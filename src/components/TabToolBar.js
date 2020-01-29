import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Typography } from "@material-ui/core";

function TabPanel(props) {
  const { value, index, item, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${item.label}`}
      aria-labelledby={item.label}
      {...other}
    >
      {value === index && <item.component />}
    </Typography>
  );
}

TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  };
}

export default function TabToolbar(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { bars } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          className={classes.tabs}
        >
          {bars.map((item, index) => (
            <Tab
              key={item.label}
              label={item.label}
              {...a11yProps(index)}
              className={classes.tab}
            />
          ))}
        </Tabs>
        {bars.map((item, index) => (
          <TabPanel
            key={item.label}
            value={value}
            index={index}
            item={item}
            style={{ overflowX: "auto" }}
          ></TabPanel>
        ))}
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minHeight: "auto"
  },
  appBar: {
    backgroundColor: theme.palette.primary[100]
  },
  tabs: {
    minHeight: "auto",
    borderBottom: "1px solid rgba(0,0,0,.12)"
  },
  tab: {
    minHeight: "auto",
    minWidth: "auto"
  }
}));
