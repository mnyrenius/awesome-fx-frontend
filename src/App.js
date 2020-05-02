import React, { useState, useEffect } from 'react'
import Menubar from './Components/Menubar'
import Preset from './Components/Preset'

const initial =
  {
  name: "Awesome FX 1",
  effects: [
  ]
}

export default function App() {
  const [currentPreset, setPreset] = useState(initial)
  const [open, setOpen] = useState(false)
  const [allEffects, setAllEffects] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    fetch('http://' + window.location.hostname + ':5396/plugins')
      .then(res => res.json())
      .then((data) => {
        setAllEffects(data)
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    fetch('http://' + window.location.hostname + ':5396/config')
      .then(res => res.json())
      .then((data) => {
        setConnected(true)
        const preset = {name: "Awesome FX 1", effects: []}
        data.forEach(fx => {
          const avail = allEffects.find(el => el.name === fx.name)
          const params = fx.parameters.map((val, index) => {
            return {name: avail.parameters[index], value: val}
          })
          preset.effects = [...preset.effects, {name: fx.name, parameters: params}]
        }
        )
        setPreset(preset)
      })
      .catch(console.log)
  }, [allEffects])

  const handleListItemClick = value => {
    const params = value.parameters.map(param => {
      return {name: param, value: 0}
    })

    setPreset(prev => {
      const updated = {...prev}
      updated.effects = [...updated.effects, {name: value.name, parameters: params}]
      return updated
    })
    setOpen(false)
  }

  const handleDeleteEffect = id => () => {
    setPreset(prev => {
      const updated = {...prev}
      updated.effects = prev.effects.filter((v, index) => index !== id)
      return updated
    })
  }

  const handleChangeSlider = fxId => (paramId, value) => {
    setPreset(prev => {
      const updated = {...prev}
      updated.effects[fxId].parameters[paramId].value = value
      return updated
    })

    const params = currentPreset.effects[fxId].parameters.map(param => {
      return param.value
    })

    fetch('http://' + window.location.hostname + ':5396/config/' + fxId, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(response => {
      })
      .catch(console.log)
  }

  const handleApplyPreset = () => {
    const config = currentPreset.effects.map(fx => {
      return {name: fx.name, parameters: fx.parameters.map(param => param.value)}
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

  const handleReload = () => {
    fetch('http://' + window.location.hostname + ':5396/reload', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json'
      },
      body: {}
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
        handleReload={handleReload}
        connected={connected}
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
