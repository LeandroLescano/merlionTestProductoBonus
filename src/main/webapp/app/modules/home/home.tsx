import './home.scss';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import ModalStock from '../components/modal-stock';

import { IRootState } from 'app/shared/reducers';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  const [productList, setProductList] = useState([]);
  const [actualProduct, setActualProduct] = useState({});
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    let token = '';
    axios({ url: window.location.href + 'api/authenticate' })
      .then(response => (token = response.config.headers.Authorization))
      .catch(error => console.error(error));
    const apiUrl = window.location.href + 'api/product-buckets';
    if (mounted) {
      axios({
        url: apiUrl,
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: token,
        },
      })
        .then(response => setProductList(response.data.sort((a, b) => a.product.id - b.product.id)))
        .catch(error => {
          console.error(error);
        });
    }
    return () => (mounted = false);
  }, []);

  const useStyles = makeStyles({
    root: {
      backgroundColor: '#2a6a9e',
      color: 'lightgray',
    },
    tableHeader: {
      backgroundColor: '#2a6a9e',
    },
    tableCell: {
      color: 'white',
    },
    button: {
      backgroundColor: '#2a6a9e',
      color: 'white',
      '&:hover': {
        backgroundColor: '#5E99C5',
      },
    },
  });

  const styles = useStyles(props);

  const handleClick = product => {
    setActualProduct(product);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Container>
      {account && account.login ? (
        <>
          <Paper>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeader}>
                  <TableCell align="center" className={styles.tableCell}>
                    Código
                  </TableCell>
                  <TableCell className={styles.tableCell}>Producto</TableCell>
                  <TableCell align="center" className={styles.tableCell}>
                    Disponibles para la venta
                  </TableCell>
                  <TableCell align="center" className={styles.tableCell}>
                    Encargados
                  </TableCell>
                  <TableCell align="center" className={styles.tableCell}>
                    Defectuosos
                  </TableCell>
                  <TableCell className={styles.tableCell}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.map((prod, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell align="center">{prod.product.id}</TableCell>
                      <TableCell>{prod.product.name}</TableCell>
                      <TableCell align="center">{prod.availableToSellQuantity}</TableCell>
                      <TableCell align="center">{prod.inChargeQuantity}</TableCell>
                      <TableCell align="center">{prod.brokenQuantity}</TableCell>
                      <TableCell align="center">
                        <Button className={`${styles.button}`} onClick={() => handleClick(prod)}>
                          Modificar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
          <ModalStock styles={styles} show={showModal} product={actualProduct} onClose={() => handleClose()} />
        </>
      ) : (
        <div>
          <Alert color="warning">
            <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
            <Link to="/login" className="alert-link">
              <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
            </Link>
            <Translate contentKey="global.messages.info.authenticated.suffix">
              , you can try the default accounts:
              <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
              <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
            </Translate>
          </Alert>

          <Alert color="warning">
            <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
            <Link to="/account/register" className="alert-link">
              <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
            </Link>
          </Alert>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
