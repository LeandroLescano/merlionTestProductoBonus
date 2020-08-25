import React, { useEffect, useState } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './modal-stock.scss';
import axios from 'axios';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function ModalStock(props) {
  const [open, setOpen] = useState(false);
  const [localProduct, setLocalProduct] = useState(undefined);
  const [stateFrom, setStateFrom] = useState<StateOptionType | null>(null);
  const [stateTo, setStateTo] = useState<StateOptionType | null>(null);
  const [errorMessageTo, setErrorMessageTo] = useState<string>('');
  const [errorMessageFrom, setErrorMessageFrom] = useState<string>('');
  const [errorMessageQuantity, setErrorMessageQuantity] = useState<string>('');

  const states = [
    { title: 'Disponible para la venta', cod: 'availableToSellQuantity' },
    { title: 'Encargados', cod: 'inChargeQuantity' },
    { title: 'Defectuosos', cod: 'brokenQuantity' },
  ];

  interface StateOptionType {
    title: string;
    cod: string;
  }

  const defaultProps = {
    options: states,
    getOptionLabel: (option: StateOptionType) => option.title,
  };

  const handleClose = () => {
    setOpen(false);
    props.onClose();
    setErrorMessageTo('');
    setErrorMessageFrom('');
    setErrorMessageQuantity('');
  };

  const handleUpdate = () => {
    //  Update product stock in db.
    if (localProduct !== props.product) {
      let token = '';
      axios({ url: window.location.href + 'api/authenticate' })
        .then(response => (token = response.config.headers.Authorization))
        .catch(error => console.error(error));
      const apiUrl = window.location.href + 'api/product-buckets';
      axios({
        url: apiUrl,
        method: 'PUT',
        headers: {
          accept: '*/*',
          Authorization: token,
        },
        data: localProduct,
      })
        .then(() => {
          handleClose();
          props.updateTable(localProduct);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      handleClose();
    }
  };

  const handleMove = () => {
    //  Move stock in local product.
    const productUpdate = { ...localProduct };
    setErrorMessageTo('');
    setErrorMessageFrom('');
    setErrorMessageQuantity('');
    let error = false;
    let errorMsg = '';
    let errorMsgFrom = '';
    const quantity = parseInt((document.getElementById('quantity-prod') as HTMLInputElement).value, 10);

    // Check input fields
    if (stateFrom !== null && stateTo !== null && quantity > 0) {
      if (stateFrom.cod !== stateTo.cod) {
        if (quantity <= productUpdate[stateFrom.cod]) {
          switch (stateTo.cod) {
            case 'availableToSellQuantity': {
              if (productUpdate[stateTo.cod] + quantity > 10) {
                errorMsg = 'No puede haber más de 10 productos disponibles para la venta.';
                error = true;
              }
              break;
            }
            case 'inChargeQuantity': {
              if (productUpdate[stateTo.cod] + quantity > 3) {
                errorMsg = 'No puede haber más de 3 productos encargados.';
                error = true;
              }
              break;
            }
            default: {
              if (productUpdate[stateTo.cod] + quantity > 2) {
                errorMsg = 'No puede haber más de 2 productos defectuosos.';
                error = true;
              }
              break;
            }
          }
        } else {
          errorMsgFrom = 'No hay suficientes productos para mover.';
          error = true;
        }
        if (!error) {
          //  Make stock movement
          productUpdate[stateFrom.cod] -= quantity;
          productUpdate[stateTo.cod] += quantity;
          setLocalProduct(productUpdate);
        } else {
          setErrorMessageFrom(errorMsgFrom);
          setErrorMessageTo(errorMsg);
        }
      } else if (stateFrom.cod === stateTo.cod) {
        setErrorMessageFrom('Ambos estados son iguales.');
        setErrorMessageTo('Ambos estados son iguales.');
      }
    } else {
      if (quantity < 0 || isNaN(quantity)) {
        setErrorMessageQuantity('Debe ingresar una cantidad válida.');
      }
      if (stateFrom === null) {
        setErrorMessageFrom('Debe elegir un estado.');
      }
      if (stateTo === null) {
        setErrorMessageTo('Debe elegir un estado.');
      }
    }
  };

  useEffect(() => {
    if (props.show) {
      setOpen(true);
      setLocalProduct(props.product);
      setStateFrom(null);
      setStateTo(null);
    } else {
      setOpen(false);
    }
  }, [props]);

  return (
    <>
      {localProduct !== undefined && (
        <Dialog disableBackdropClick={true} fullWidth={true} maxWidth="md" onClose={handleClose} aria-labelledby="stock-modal" open={open}>
          <DialogTitle id="stock-modal" onClose={handleClose}>
            {localProduct.product.id + ' - ' + localProduct.product.name}
          </DialogTitle>
          <DialogContent dividers>
            <Grid justify="center" alignItems="center" container spacing={4}>
              <Grid item xs={4}>
                <Autocomplete
                  {...defaultProps}
                  id="cmbStates-from"
                  value={stateFrom}
                  noOptionsText="Sin opciones"
                  getOptionSelected={(option, value) => value.title === option.title}
                  onChange={(event: any, newValue: StateOptionType | null) => {
                    setStateFrom(newValue);
                    setErrorMessageFrom('');
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={errorMessageFrom !== '' ? true : false}
                      style={errorMessageFrom !== '' ? { height: '48px' } : {}}
                      helperText={errorMessageFrom}
                      label="Desde"
                      variant="standard"
                    />
                  )}
                />
              </Grid>
              <Grid style={{ textAlignLast: 'center' }} item xs={4}>
                <TextField
                  error={errorMessageQuantity !== '' ? true : false}
                  style={errorMessageQuantity !== '' ? { height: '48px' } : {}}
                  helperText={errorMessageQuantity}
                  label="Cantidad"
                  type="number"
                  id="quantity-prod"
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  {...defaultProps}
                  id="cmbStates-to"
                  value={stateTo}
                  noOptionsText="Sin opciones"
                  onChange={(event: any, newValue: StateOptionType | null) => {
                    setStateTo(newValue);
                    setErrorMessageTo('');
                  }}
                  getOptionSelected={(option, value) => value.title === option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={errorMessageTo !== '' ? true : false}
                      style={errorMessageTo !== '' ? { height: '48px' } : {}}
                      helperText={errorMessageTo}
                      label="Hacia"
                      variant="standard"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid style={{ textAlign: 'center', marginTop: '10px' }} item xs={12}>
                <Button className={props.styles.button} onClick={() => handleMove()}>
                  Mover stock
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <h5>Stock actual</h5>
              </Grid>
            </Grid>
            <div className="row-center">
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  Disponibles para la venta
                </Grid>
                <Grid item xs={4}>
                  Encargados
                </Grid>
                <Grid item xs={4}>
                  Defectuosos
                </Grid>
              </Grid>
              <Grid style={{ marginTop: '10px' }} justify="center" alignContent="center" container>
                <Grid item xs={4}>
                  <span className="stock-number">{localProduct.availableToSellQuantity}</span>
                </Grid>
                <Grid item xs={4}>
                  <span className="stock-number">{localProduct.inChargeQuantity}</span>
                </Grid>
                <Grid item xs={4}>
                  <span className="stock-number">{localProduct.brokenQuantity}</span>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button autoFocus onClick={() => handleUpdate()} className={props.styles.button}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ModalStock;
