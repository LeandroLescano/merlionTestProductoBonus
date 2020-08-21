import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './product-bucket.reducer';
import { IProductBucket } from 'app/shared/model/product-bucket.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProductBucketDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProductBucketDetail = (props: IProductBucketDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { productBucketEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="testApp.productBucket.detail.title">ProductBucket</Translate> [<b>{productBucketEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="availableToSellQuantity">
              <Translate contentKey="testApp.productBucket.availableToSellQuantity">Available To Sell Quantity</Translate>
            </span>
          </dt>
          <dd>{productBucketEntity.availableToSellQuantity}</dd>
          <dt>
            <span id="inChargeQuantity">
              <Translate contentKey="testApp.productBucket.inChargeQuantity">In Charge Quantity</Translate>
            </span>
          </dt>
          <dd>{productBucketEntity.inChargeQuantity}</dd>
          <dt>
            <span id="brokenQuantity">
              <Translate contentKey="testApp.productBucket.brokenQuantity">Broken Quantity</Translate>
            </span>
          </dt>
          <dd>{productBucketEntity.brokenQuantity}</dd>
          <dt>
            <Translate contentKey="testApp.productBucket.product">Product</Translate>
          </dt>
          <dd>{productBucketEntity.product ? productBucketEntity.product.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/product-bucket" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product-bucket/${productBucketEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ productBucket }: IRootState) => ({
  productBucketEntity: productBucket.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProductBucketDetail);
