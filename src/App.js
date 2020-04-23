import React, { useState, useEffect } from 'react'
import Menubar from './Components/Menubar'
import Preset from './Components/Preset'
import { v4 as uuidv4 } from 'uuid'

const test = {
  name: "Awesome FX 1",
  effects: {
    0: { name: "Delay", parameters: {
      0: { name: "Time", value: 10 },
      1: { name: "Feedback", value: 20 },
    }},
    1: { name: "Reverb", parameters: {
      0: { name: "Size", value: 10 },
      1: { name: "Mix", value: 20 },
    }}
  }
}


export default function App() {
  const [currentPreset, setPreset] = useState(test)
  const [open, setOpen] = useState(false)
  const [allEffects, setAllEffects] = useState([])

  useEffect(() => {
    fetch('http://' + window.location.hostname + ':5396/plugins')
      .then(res => res.json())
      .then((data) => {
        setAllEffects(data)
      })
      .catch(console.log)
  }, [])

  const handleListItemClick = value => {
    const params = value.parameters.map(param => {
      return {name: param, value: 0}
    })

    setPreset(prev => {
      const id = uuidv4()
      const updated = {...prev}
      updated.effects[id] = {name: value.name, parameters: params}
      return updated
    })
    setOpen(false)
  }

  const handleDeleteEffect = id => () => {
    setPreset(prev => {
      const updated = {...prev}
      delete updated.effects[id]
      return updated
    })
  }

  const handleChangeSlider = fxId => (paramName, value) => {
    setPreset(prev => {
      const updated = {...prev}
      updated.effects[fxId].parameters[paramName].value = value
      return updated
    })
  }

  const handleApplyPreset = () => {
    const config = Object.entries(currentPreset.effects).map(([k, v], i) => {
      return {name: v.name, parameters: Object.entries(v.parameters).map(([pk, pv], pi) => pv["value"])}
    })

    fetch('http://' + window.location.hostname + ':5396/config', {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(config)
    })
      .then(response => {
      })
      .catch(console.log)
  }

  return (
    <React.Fragment>
      <Menubar
        title={currentPreset.name}
        handleApply={handleApplyPreset}
      />
      <Preset
        currentPreset={currentPreset}
        handleDeleteEffect={handleDeleteEffect}
        handleChangeSlider={handleChangeSlider}
        handleListItemClick={handleListItemClick}
        setOpen={setOpen}
        setClose={() => setOpen(false)}
        open={open}
        availableEffects={allEffects}
      />
    </React.Fragment>
  )
}
