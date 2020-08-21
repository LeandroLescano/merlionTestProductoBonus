import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProductBucket, defaultValue } from 'app/shared/model/product-bucket.model';

export const ACTION_TYPES = {
  FETCH_PRODUCTBUCKET_LIST: 'productBucket/FETCH_PRODUCTBUCKET_LIST',
  FETCH_PRODUCTBUCKET: 'productBucket/FETCH_PRODUCTBUCKET',
  CREATE_PRODUCTBUCKET: 'productBucket/CREATE_PRODUCTBUCKET',
  UPDATE_PRODUCTBUCKET: 'productBucket/UPDATE_PRODUCTBUCKET',
  DELETE_PRODUCTBUCKET: 'productBucket/DELETE_PRODUCTBUCKET',
  RESET: 'productBucket/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProductBucket>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type ProductBucketState = Readonly<typeof initialState>;

// Reducer

export default (state: ProductBucketState = initialState, action): ProductBucketState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PRODUCTBUCKET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PRODUCTBUCKET):
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
    case REQUEST(ACTION_TYPES.DELETE_PRODUCTBUCKET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PRODUCTBUCKET):
    case FAILURE(ACTION_TYPES.CREATE_PRODUCTBUCKET):
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
    case FAILURE(ACTION_TYPES.DELETE_PRODUCTBUCKET):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PRODUCTBUCKET):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PRODUCTBUCKET):
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PRODUCTBUCKET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/product-buckets';

// Actions

export const getEntities: ICrudGetAllAction<IProductBucket> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST,
  payload: axios.get<IProductBucket>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IProductBucket> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PRODUCTBUCKET,
    payload: axios.get<IProductBucket>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProductBucket> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PRODUCTBUCKET,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProductBucket> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PRODUCTBUCKET,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProductBucket> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PRODUCTBUCKET,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
