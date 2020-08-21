import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProduct } from 'app/shared/model/product.model';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getEntity, updateEntity, createEntity, reset } from './product-bucket.reducer';
import { IProductBucket } from 'app/shared/model/product-bucket.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProductBucketUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProductBucketUpdate = (props: IProductBucketUpdateProps) => {
  const [productId, setProductId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { productBucketEntity, products, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/product-bucket');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProducts();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...productBucketEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="testApp.productBucket.home.createOrEditLabel">
            <Translate contentKey="testApp.productBucket.home.createOrEditLabel">Create or edit a ProductBucket</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : productBucketEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="product-bucket-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="product-bucket-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="availableToSellQuantityLabel" for="product-bucket-availableToSellQuantity">
                  <Translate contentKey="testApp.productBucket.availableToSellQuantity">Available To Sell Quantity</Translate>
                </Label>
                <AvField
                  id="product-bucket-availableToSellQuantity"
                  type="text"
                  name="availableToSellQuantity"
                  validate={{
                    max: { value: 10, errorMessage: translate('entity.validation.max', { max: 10 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="inChargeQuantityLabel" for="product-bucket-inChargeQuantity">
                  <Translate contentKey="testApp.productBucket.inChargeQuantity">In Charge Quantity</Translate>
                </Label>
                <AvField
                  id="product-bucket-inChargeQuantity"
                  type="text"
                  name="inChargeQuantity"
                  validate={{
                    max: { value: 3, errorMessage: translate('entity.validation.max', { max: 3 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="brokenQuantityLabel" for="product-bucket-brokenQuantity">
                  <Translate contentKey="testApp.productBucket.brokenQuantity">Broken Quantity</Translate>
                </Label>
                <AvField
                  id="product-bucket-brokenQuantity"
                  type="text"
                  name="brokenQuantity"
                  validate={{
                    max: { value: 2, errorMessage: translate('entity.validation.max', { max: 2 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="product-bucket-product">
                  <Translate contentKey="testApp.productBucket.product">Product</Translate>
                </Label>
                <AvInput id="product-bucket-product" type="select" className="form-control" name="product.id">
                  <option value="" key="0" />
                  {products
                    ? products.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/product-bucket" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  products: storeState.product.entities,
  productBucketEntity: storeState.productBucket.entity,
  loading: storeState.productBucket.loading,
  updating: storeState.productBucket.updating,
  updateSuccess: storeState.productBucket.updateSuccess,
});

const mapDispatchToProps = {
  getProducts,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProductBucketUpdate);
