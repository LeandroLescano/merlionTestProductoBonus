import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './product-bucket.reducer';
import { IProductBucket } from 'app/shared/model/product-bucket.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProductBucketProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProductBucket = (props: IProductBucketProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { productBucketList, match, loading } = props;
  return (
    <div>
      <h2 id="product-bucket-heading">
        <Translate contentKey="testApp.productBucket.home.title">Product Buckets</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="testApp.productBucket.home.createLabel">Create new Product Bucket</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {productBucketList && productBucketList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="testApp.productBucket.availableToSellQuantity">Available To Sell Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="testApp.productBucket.inChargeQuantity">In Charge Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="testApp.productBucket.brokenQuantity">Broken Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="testApp.productBucket.product">Product</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productBucketList.map((productBucket, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${productBucket.id}`} color="link" size="sm">
                      {productBucket.id}
                    </Button>
                  </td>
                  <td>{productBucket.availableToSellQuantity}</td>
                  <td>{productBucket.inChargeQuantity}</td>
                  <td>{productBucket.brokenQuantity}</td>
                  <td>{productBucket.product ? <Link to={`product/${productBucket.product.id}`}>{productBucket.product.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${productBucket.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${productBucket.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${productBucket.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="testApp.productBucket.home.notFound">No Product Buckets found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ productBucket }: IRootState) => ({
  productBucketList: productBucket.entities,
  loading: productBucket.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProductBucket);
