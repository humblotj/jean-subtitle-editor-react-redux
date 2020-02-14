import React from "react";
import { Select, FormControl, IconButton, MenuItem } from "@material-ui/core";
import { SwapHoriz as SwapHorizIcon } from "@material-ui/icons";

export default function SwapLanguages(props) {
  const {
    languagesSupported,
    sourceLanguage,
    targetLanguage,
    onSLSelected,
    onTLSelected,
    swapLanguages
  } = props;

  return (
    <React.Fragment>
      <FormControl style={{ width: 120 }}>
        <Select value={sourceLanguage} onChange={onSLSelected}>
          {languagesSupported.map((lang, i) => (
            <MenuItem key={i} value={lang.value}>
              {lang.viewValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton aria-label="swap" size="small" onClick={swapLanguages}>
        <SwapHorizIcon />
      </IconButton>
      <FormControl style={{ width: 120, marginRight: "8px" }}>
        <Select value={targetLanguage} onChange={onTLSelected}>
          {languagesSupported.map((lang, i) => (
            <MenuItem key={i} value={lang.value}>
              {lang.viewValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
