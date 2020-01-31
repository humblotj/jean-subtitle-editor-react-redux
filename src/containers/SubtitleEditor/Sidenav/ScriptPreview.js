import React from "react";
import { connect } from "react-redux";
import { Box, Divider } from "@material-ui/core";

class ScriptLine extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.indexActive === nextProps.indexActive &&
      this.props.script === nextProps.script &&
      this.props.scriptTranslation === nextProps.scriptTranslation
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { indexActive, script, scriptTranslation } = this.props;

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
}

const mapStateToProps = state => {
  return {
    indexActive: state.subtitle.indexActive,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation
  };
};

export default connect(mapStateToProps, null)(ScriptLine);
