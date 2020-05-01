import React from 'react'

import {
  Grid,
  Typography,
  IconButton,
  Slider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@material-ui/icons/Add'

function Effect({fx, handleDelete, handleChangeSlider}) {
  let sliderTimeoutId = 0

  return (
    <ExpansionPanel>
          <ExpansionPanelSummary>
            <Typography>
              {fx.name}
            </Typography>
            <IconButton
              color="inherit"
              style={{marginLeft: 'auto'}}
              onClick={handleDelete}
            >
              <ClearIcon
                fontSize="small"
              />
            </IconButton>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={1}>
              {Object.entries(fx.parameters).map(([k, param], index) => (
                <React.Fragment key={param.name}>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      {param.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Slider
                      value={param.value}
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                      onChange={(e, value) => {
                        clearTimeout(sliderTimeoutId)
                        sliderTimeoutId = setTimeout(() => {
                          handleChangeSlider(k, value)
                        }, 5)
                      }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
          </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
  )
}

export default function Preset(props) {
  return (
    <React.Fragment>
      {Object.entries(props.currentPreset.effects).map(([k, fx], index) => (
        <Effect
          fx={fx}
          handleDelete={props.handleDeleteEffect(k)}
          handleChangeSlider={props.handleChangeSlider(k)}
          key={k}
        />
     ))}
      <IconButton
        color="inherit"
        onClick={e => props.setOpen(true)}
      >
        <AddIcon />
      </IconButton>
      <Dialog onClose={props.setClose} open={props.open}>
      <DialogTitle>Add effect</DialogTitle>
      <List>
        {props.availableEffects.map((fx) => (
          <ListItem button onClick={() => props.handleListItemClick(fx)} key={fx.name}>
            <ListItemText primary={fx.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
    </React.Fragment>
  )
}
