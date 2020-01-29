import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";

import TabToolbar from "../../components/TabToolBar";
import HomeTab from "./ToolBar/HomeTab";
import VideoTab from "./ToolBar/VideoTab";
import SimpleSnackbar from "../../components/SimpleSnackBar";
import FixedDrawer from "../../components/FixedDrawer";
import Sidenav from "./Sidenav/Sidenav";
import Main from "./Main/Main";
import SubtitleTab from "./ToolBar/SubtitleTab";

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: indigo
  }
});

const bars = [
  // { label: "Home", component: HomeTab },
  { label: "Subtitle", component: SubtitleTab },
  { label: "Video", component: VideoTab }
];

class SubtitleEditor extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ display: "flex" }}>
          <TabToolbar bars={bars} openSnackBar={this.openSnackBar} />
          <FixedDrawer component={Sidenav} />
          <Main />
        </div>
        <SimpleSnackbar />
      </MuiThemeProvider>
    );
  }
}

export default SubtitleEditor;
