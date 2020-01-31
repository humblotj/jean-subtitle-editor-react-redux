import React from "react";
import {
  Dialog,
  Button,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";

import * as SubtitleParser from "../../../../Utils/SubtitleParser";

const useStyles = makeStyles(theme => ({
  timeContainer: {
    width: "56px",
    height: "18px",

    border: "none",
    overflow: "auto",
    outline: "none",
    boxShadow: "none"
  }
}));

export default function ShiftTimes(props) {
  const classes = useStyles();

  const { onClose, length, open } = props;
  const [time, setTime] = React.useState("00:00.00");
  const [begin, setBegin] = React.useState(1);
  const [end, setEnd] = React.useState(length);
  const [forward, setForward] = React.useState("forward");
  const [target, setTarget] = React.useState("both");

  const handleClose = () => {
    onClose();
  };

  const shiftTimes = () => {
    onClose({
      time: SubtitleParser.timeToMs(time),
      begin,
      end,
      forward,
      target
    });
  };

  const timeChanged = event => {
    if (event.currentTarget.value.match(/^[0-5][0-9]:[0-5][0-9].[0-9]{2}/)) {
      setTime(event.currentTarget.value);
    } else {
      setTime(time);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <div style={{ padding: "10px" }}>
        <MaskedInput
          mask={[/[0-5]/, /\d/, ":", /[0-5]/, /\d/, ".", /\d/, /\d/]}
          placeholderChar={"\u2000"}
          showMask
          className={classes.timeContainer}
          value={time}
          onBlur={timeChanged}
        />
        <RadioGroup
          value={forward}
          onChange={event => setForward(event.currentTarget.value)}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <FormControlLabel
            value="forward"
            control={<Radio />}
            label="Forward"
          />
          <FormControlLabel
            value="backward"
            control={<Radio />}
            label="Backward"
          />
        </RadioGroup>
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
        <RadioGroup
          value={target}
          onChange={event => setTarget(event.currentTarget.value)}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <FormControlLabel
            value="both"
            control={<Radio />}
            label="Start and End times"
          />
          <FormControlLabel
            value="start"
            control={<Radio />}
            label="Start times only"
          />
          <FormControlLabel
            value="end"
            control={<Radio />}
            label="End times only"
          />
        </RadioGroup>
        <Button
          variant="outlined"
          color="primary"
          onClick={shiftTimes}
          style={{ display: "block" }}
        >
          Shift Times
        </Button>
      </div>
    </Dialog>
  );
}

ShiftTimes.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  length: PropTypes.number.isRequired
};
