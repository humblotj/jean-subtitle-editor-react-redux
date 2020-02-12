import React from "react";
import { connect } from "react-redux";
import {
  Button,
  IconButton,
  Box,
  Divider,
  MenuItem,
  MenuList,
  ListItemIcon,
  Typography,
  Grow,
  Paper,
  Popper,
  ClickAwayListener,
  Select,
  FormControl
} from "@material-ui/core";
import {
  Subtitles as SubtitlesIcon,
  SubtitlesOutlined as SubtitlesOutlinedIcon,
  Folder as FolderIcon,
  Mic as MicIcon,
  Translate as TranslateIcon,
  SwapHoriz as SwapHorizIcon
} from "@material-ui/icons";
import axios from "axios";
import * as FileSaver from "file-saver";

import * as actions from "../../../store/actions/index";
import * as SubtitleParser from "../../../Utils/SubtitleParser";
import * as Translate from "../../../Utils/Translate";
import { EventEmitter } from "../../../Utils/events";

const languagesSupported = [
  { value: "ko", viewValue: "Korean" },
  { value: "en", viewValue: "English" },
  { value: "zh-cn", viewValue: "Chinese (Simplified)" },
  { value: "zh-tw", viewValue: "Chinese (Traditional)" },
  { value: "ja", viewValue: "Japanese" }
];

const extensions = ["srt", "sbv", "ass", "mss", "txt", "xlsx"];

class SubtitleTab extends React.Component {
  constructor() {
    super();

    this.menuSubtitle = React.createRef();
    this.menuTranslation = React.createRef();
    this.exportSubtitle = React.createRef();
    this.exportTranslation = React.createRef();
    this.subtitleInput = React.createRef();
    this.translationInput = React.createRef();

    this.state = {
      openMenuSubtitle: false,
      openMenuTranslation: false,
      openExportSubtitle: false,
      openExportTranslation: false,
      sourceLanguage: "en",
      targetLanguage: "ko"
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.timeStamp === nextProps.timeStamp &&
      this.state.openMenuSubtitle === nextState.openMenuSubtitle &&
      this.state.openMenuTranslation === nextState.openMenuTranslation &&
      this.state.openExportSubtitle === nextState.openExportSubtitle &&
      this.state.openExportTranslation === nextState.openExportTranslation &&
      this.state.sourceLanguage === nextState.sourceLanguage &&
      this.state.targetLanguage === nextState.targetLanguage
    ) {
      return false;
    }
    return true;
  }

  toggleSubtitle = () => {
    this.setState(state => ({ openMenuSubtitle: !state.openMenuSubtitle }));
  };

  toggleTranslation = () => {
    this.setState(state => ({
      openMenuTranslation: !state.openMenuTranslation
    }));
  };

  toggleExportSubtitle = () => {
    this.setState(state => ({ openExportSubtitle: !state.openExportSubtitle }));
  };

  toggleExportTranslation = () => {
    this.setState(state => ({
      openExportTranslation: !state.openExportTranslation
    }));
  };

  handleClose = () => {
    this.setState({
      openMenuSubtitle: false,
      openMenuTranslation: false,
      openExportSubtitle: false,
      openExportTranslation: false
    });
  };

  onSubtitleFileSelected = event => {
    this.handleClose();
    const file = event.target.files[0];
    if (file != null) {
      const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        const rawData = SubtitleParser.parse(data, extension);
        this.handleSubtitleData(rawData);
      };
      fileReader.readAsText(file);
    }
  };

  onSubtitleSelected = subtitle => {
    this.handleClose();
    const url = "https://video.google.com/timedtext";
    const params =
      subtitle.name !== ""
        ? {
            name: subtitle.name,
            lang: subtitle.lang_code,
            v: this.props.videoId,
            fmt: "vtt"
          }
        : {
            lang: subtitle.lang_code,
            v: this.props.videoId,
            fmt: "vtt"
          };
    axios
      .get(url, {
        params
      })
      .then(result => {
        const rawData = SubtitleParser.parse(result.data, "vtt");
        this.handleSubtitleData(rawData);
      });
  };

  handleSubtitleData = data => {
    EventEmitter.dispatch("do", null);
    const timeStamp = data.map(line => ({
      startMs: line.startTime,
      endMs: line.endTime
    }));
    const script = this.getFullText(data);
    for (let i = script.length; i < timeStamp.length; i++) {
      script[i] = "";
    }
    const scriptTranslation = [];
    const preview = [];
    for (let i = 0; i < timeStamp.length; i++) {
      scriptTranslation[i] = "";
      preview[i] = { en: "", ko: "", rpa: "" };
    }
    const indexActive = timeStamp.length ? 0 : null;
    this.props.subtitleSelected(
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive
    );

    EventEmitter.dispatch("refreshRegion", null);
  };

  onTranslationFileSelected = event => {
    this.handleClose();
    const file = event.target.files[0];
    if (file != null) {
      const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        const rawData = SubtitleParser.parse(data, extension);
        this.handleTranslationData(rawData);
      };
      fileReader.readAsText(file);
    }
  };

  onTranslationSelected = subtitle => {
    this.handleClose();
    const url = "https://video.google.com/timedtext";
    const params =
      subtitle.name !== ""
        ? {
            name: subtitle.name,
            lang: subtitle.lang_code,
            v: this.props.videoId,
            fmt: "vtt"
          }
        : {
            lang: subtitle.lang_code,
            v: this.props.videoId,
            fmt: "vtt"
          };
    axios
      .get(url, {
        params
      })
      .then(result => {
        const rawData = SubtitleParser.parse(result.data, "vtt");
        this.handleTranslationData(rawData);
      });
  };

  handleTranslationData = data => {
    EventEmitter.dispatch("do", null);

    let timeStamp = data.map(line => ({
      startMs: line.startTime,
      endMs: line.endTime
    }));
    const scriptTranslation = this.getFullText(data);
    let script = this.props.script.slice();
    let preview = this.props.preview.slice();
    if (timeStamp.length < this.props.timeStamp.length) {
      for (let i = timeStamp.length; i < this.props.timeStamp.length; i++) {
        scriptTranslation[i] = "";
      }
    } else if (timeStamp.length > this.props.timeStamp.length) {
      const timeStampTmp = this.props.timeStamp.slice();
      for (let i = this.props.timeStamp.length; i < timeStamp.length; i++) {
        timeStampTmp[i] = timeStamp[i];
        script[i] = "";
        preview[i] = { en: "", ko: "", rpa: "" };
      }
      timeStamp = timeStampTmp;
    }
    this.props.translationSelected(
      timeStamp,
      script,
      scriptTranslation,
      preview
    );
  };

  getFullText = srt => {
    return srt.map(line => line.text);
  };

  translate = () => {
    const fullText = this.props.script
      .join("\r\n")
      .replace(/(?<!\r)\n/g, " ")
      .replace(/\{(.*?)\}|\|/gi, "");
    Translate.translate(
      fullText,
      this.state.sourceLanguage,
      this.state.targetLanguage
    ).then(result => {
      const scriptTranslation = result.split("\r\n");
      for (
        let i = scriptTranslation.length;
        i < this.props.timeStamp.length;
        i++
      ) {
        scriptTranslation[i] = "";
      }
      this.props.translationSelected(
        this.props.timeStamp,
        this.props.script,
        scriptTranslation,
        this.props.preview
      );
    });
  };

  onSLSelected = event => {
    if (this.state.targetLanguage === event.target.value) {
      this.swapLanguages();
    } else {
      this.setState({ sourceLanguage: event.target.value });
    }
  };

  onTLSelected = event => {
    if (this.state.sourceLanguage === event.target.value) {
      this.swapLanguages();
    } else {
      this.setState({ targetLanguage: event.target.value });
    }
  };

  swapLanguages = () => {
    this.setState(state => ({
      sourceLanguage: state.targetLanguage,
      targetLanguage: state.sourceLanguage
    }));
  };

  onExport = (extension, script) => {
    let blob;
    switch (extension) {
      case "xlsx":
        break;
      case "txt":
        blob = new Blob([script.join("\n").replace(/\{(.*?)\}|\|/gi, "")], {
          type: "text/plain"
        });
        break;
      case "ass":
      case "mss": {
        const dataJSON = this.props.timeStamp.map((line, index) => {
          return {
            id: index,
            start: line.startMs,
            end: line.endMs,
            text: script[index].trim()
          };
        });
        const dataFile = SubtitleParser.build(dataJSON, extension);
        blob = new Blob([dataFile], { type: "." + extension });
        break;
      }
      default: {
        const dataJSON = this.props.timeStamp.map((line, index) => {
          return {
            id: index,
            start: line.startMs,
            end: line.endMs,
            text: script[index].replace(/\{(.*?)\}/gi, "").trim()
          };
        });
        const dataFile = SubtitleParser.build(dataJSON, extension);
        blob = new Blob([dataFile], { type: "." + extension });
        break;
      }
    }
    const lang = script === this.props.script ? "ko" : "en";
    FileSaver.saveAs(
      blob,
      this.props.projectName + "_" + lang + "." + extension
    );
  };

  render() {
    const {
      openMenuSubtitle,
      openMenuTranslation,
      openExportSubtitle,
      openExportTranslation,
      sourceLanguage,
      targetLanguage
    } = this.state;
    const { subtitleList, script, scriptTranslation } = this.props;

    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{ height: "60px", width: "max-content", minWidth: "100%" }}
      >
        <Button ref={this.menuSubtitle} onClick={this.toggleSubtitle}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <SubtitlesOutlinedIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Select Subtitle
            </span>
          </Box>
        </Button>
        <Popper
          open={openMenuSubtitle}
          anchorEl={this.menuSubtitle.current}
          role={undefined}
          transition
          disablePortal
          style={{ marginTop: "54px" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList autoFocusItem={openMenuSubtitle}>
                    <input
                      hidden
                      type="file"
                      accept=".srt,.sbv,.ass, .mss, .txt, .xlsx"
                      ref={this.subtitleInput}
                      onChange={this.onSubtitleFileSelected}
                    />
                    <MenuItem
                      onClick={() => {
                        this.subtitleInput.current.click();
                        this.subtitleInput.current.value = null;
                      }}
                    >
                      <ListItemIcon>
                        <FolderIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        variant="inherit"
                        style={{ marginLeft: "-25px" }}
                      >
                        from files
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} disabled={true}>
                      <ListItemIcon>
                        <MicIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        variant="inherit"
                        style={{ marginLeft: "-25px" }}
                      >
                        generate from audio
                      </Typography>
                    </MenuItem>
                    {subtitleList.map((subtitle, i) => (
                      <MenuItem
                        key={i}
                        onClick={() => this.onSubtitleSelected(subtitle)}
                      >
                        {subtitle.lang_translated}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Divider orientation="vertical" />
        <Button
          ref={this.menuTranslation}
          onClick={this.toggleTranslation}
          disabled={!this.props.timeStamp.length}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <SubtitlesIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Select Translation
            </span>
          </Box>
        </Button>
        <Popper
          open={openMenuTranslation}
          anchorEl={this.menuTranslation.current}
          role={undefined}
          transition
          disablePortal
          style={{ marginTop: "54px" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList autoFocusItem={openMenuTranslation}>
                    <input
                      hidden
                      type="file"
                      accept=".srt,.sbv,.ass, .mss, .txt, .xlsx"
                      ref={this.translationInput}
                      onChange={this.onTranslationFileSelected}
                    />
                    <MenuItem
                      onClick={() => {
                        this.translationInput.current.click();
                        this.translationInput.current.value = null;
                      }}
                    >
                      <ListItemIcon>
                        <FolderIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        variant="inherit"
                        style={{ marginLeft: "-25px" }}
                      >
                        from files
                      </Typography>
                    </MenuItem>
                    {subtitleList.map((subtitle, i) => (
                      <MenuItem
                        key={i}
                        onClick={() => this.onTranslationSelected(subtitle)}
                      >
                        {subtitle.lang_translated}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Divider orientation="vertical" />
        <Button
          onClick={this.translate}
          disabled={!this.props.timeStamp.length}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <TranslateIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Translate
            </span>
          </Box>
        </Button>
        <FormControl style={{ width: 120 }}>
          <Select value={sourceLanguage} onChange={this.onSLSelected}>
            {languagesSupported.map((lang, i) => (
              <MenuItem key={i} value={lang.value}>
                {lang.viewValue}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton aria-label="swap" size="small" onClick={this.swapLanguages}>
          <SwapHorizIcon />
        </IconButton>
        <FormControl style={{ width: 120, marginRight: "8px" }}>
          <Select value={targetLanguage} onChange={this.onTLSelected}>
            {languagesSupported.map((lang, i) => (
              <MenuItem key={i} value={lang.value}>
                {lang.viewValue}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider orientation="vertical" />
        <Button
          ref={this.exportSubtitle}
          onClick={this.toggleExportSubtitle}
          disabled={!this.props.timeStamp.length}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <SubtitlesOutlinedIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Export Subtitle
            </span>
          </Box>
        </Button>
        <Popper
          open={openExportSubtitle}
          anchorEl={this.exportSubtitle.current}
          role={undefined}
          transition
          disablePortal
          style={{ marginTop: "54px" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList autoFocusItem={openExportSubtitle}>
                    {extensions.map((extension, i) => (
                      <MenuItem
                        key={i}
                        onClick={() => this.onExport(extension, script)}
                        disabled={extension === "ass" || extension === "mss"}
                      >
                        as .{extension}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Divider orientation="vertical" />
        <Button
          ref={this.exportTranslation}
          onClick={this.toggleExportTranslation}
          disabled={!this.props.timeStamp.length}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <SubtitlesOutlinedIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Export Translation
            </span>
          </Box>
        </Button>
        <Popper
          open={openExportTranslation}
          anchorEl={this.exportTranslation.current}
          role={undefined}
          transition
          disablePortal
          style={{ marginTop: "54px" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList autoFocusItem={openExportTranslation}>
                    {extensions.map((extension, i) => (
                      <MenuItem
                        key={i}
                        onClick={() =>
                          this.onExport(extension, scriptTranslation)
                        }
                        disabled={extension === "ass" || extension === "mss"}
                      >
                        as .{extension}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Divider orientation="vertical" />
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    wavesurfer: state.video.wavesurfer,
    videoId: state.video.videoId,
    subtitleList: state.subtitle.subtitleList,
    timeStamp: state.subtitle.timeStamp,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation,
    preview: state.subtitle.preview,
    projectName: state.subtitle.projectName,
    indexActive: state.subtitle.indexActive
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    videoSelected: (videoType, url) =>
      dispatch(actions.videoSelected(videoType, url)),
    subtitleSelected: (
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive
    ) =>
      dispatch(
        actions.subtitleSelected(
          timeStamp,
          script,
          scriptTranslation,
          preview,
          indexActive
        )
      ),
    translationSelected: (timeStamp, script, scriptTranslation, preview) =>
      dispatch(
        actions.translationSelected(
          timeStamp,
          script,
          scriptTranslation,
          preview
        )
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleTab);
