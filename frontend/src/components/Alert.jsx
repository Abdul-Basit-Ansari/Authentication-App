import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function Myalert(props) {
  

  return (
    <Box sx={{ width: '100%'  }}>
      <Collapse in={props.open}>
        <Alert
        severity={props.type}
          action={
            <IconButton

              aria-label="close"
              size="small"
              onClick={() => {
                props.setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
           sx={{ fontSize:{xs:"10px" , md:"11px" , lg:"13px"}}}
        >
          {props.msg}
        </Alert>
      </Collapse>
      {/* <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Re-open
      </Button> */}
    </Box>
  );
}