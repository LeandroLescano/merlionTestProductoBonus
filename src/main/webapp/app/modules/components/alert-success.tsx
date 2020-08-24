import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Slide, { SlideProps } from '@material-ui/core/Slide';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

export interface SnackbarMessage {
  message: string;
  key: number;
}

type AlertProps = {
  show: boolean;
  message: string;
  close: any;
};

function AlertSuccess({ show, message, close }: AlertProps) {
  const [open, setOpen] = useState(false);
  const [snackPack, setSnackPack] = useState<SnackbarMessage[]>([]);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack(prev => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
      close();
    }
  }, [snackPack, messageInfo, open]);

  useEffect(() => {
    if (show) {
      setSnackPack(prev => [...prev, { message, key: new Date().getTime() }]);
    }
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    close();
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      onExited={handleExited}
      TransitionComponent={TransitionLeft}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert variant="filled" severity="success">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertSuccess;
