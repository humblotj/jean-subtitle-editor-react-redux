import React from "react";
import { Box, Divider } from "@material-ui/core";

import PropTypes from "prop-types";

export default function ScriptLine(props) {
  const { indexActive, script, scriptTranslation } = props;

  return (
    <Box style={{ width: "100%" }} display="flex" flexDirection="column">
      <div
        style={{
          padding: "12px 16px",
          fontSize: "18px"
        }}
      >
        {script[indexActive]}
      </div>
      <Divider />
      <div
        style={{
          padding: "12px 16px",
          fontSize: "16px",
          color: "rgba(80,80,80,0.64)"
        }}
      >
        {scriptTranslation[indexActive]}
      </div>
    </Box>
  );
}

ScriptLine.propTypes = {
  script: PropTypes.any.isRequired,
  scriptTranslation: PropTypes.any.isRequired
};
