import React from "react";
import { Dialog, Button, Box } from "@material-ui/core";
import PropTypes from "prop-types";

export default function RemoveLines(props) {
  const { onClose, length, open } = props;
  const [begin, setBegin] = React.useState(1);
  const [end, setEnd] = React.useState(length);

  const handleClose = () => {
    onClose();
  };

  const removeLines = () => {
    onClose({begin, end});
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <div style={{ padding: "10px" }}>
        <Box display="flex" flexDirection="row" style={{ marginBottom: "8px" }}>
          <input
            type="number"
            placeholder="Start Row"
            value={begin}
            min={1}
            max={end - 1}
            onChange={event => setBegin(event.currentTarget.value)}
            style={{ width: "50px", marginRight: "10px" }}
          />
          <input
            type="number"
            placeholder="End Row"
            value={end}
            min={begin + 1}
            max={length}
            onChange={event => setEnd(event.currentTarget.value)}
            style={{ width: "50px" }}
          />
        </Box>
        <Button variant="outlined" color="primary" onClick={removeLines}>
          Remove Lines
        </Button>
      </div>
    </Dialog>
  );
}

RemoveLines.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  length: PropTypes.number.isRequired
};
