import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProductBucket from './product-bucket';
import ProductBucketDetail from './product-bucket-detail';
import ProductBucketUpdate from './product-bucket-update';
import ProductBucketDeleteDialog from './product-bucket-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProductBucketUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProductBucketUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProductBucketDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProductBucket} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProductBucketDeleteDialog} />
  </>
);

export default Routes;
