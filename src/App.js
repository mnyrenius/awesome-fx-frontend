import React, { useState, useEffect } from 'react'
import Menubar from './Components/Menubar'
import Preset from './Components/Preset'
import { v4 as uuidv4 } from 'uuid'

const empty = {
  name: "Awesome FX 1",
  effects: {
  }
}


export default function App() {
  const [currentPreset, setPreset] = useState(empty)
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

  useEffect(() => {
    fetch('http://' + window.location.hostname + ':5396/config')
      .then(res => res.json())
      .then((data) => {
        const preset = {name: "Awesome FX 1", effects: {}}
        data.forEach(fx => {
          const avail = allEffects.find(el => el.name === fx.name)
          const params = fx.parameters.map((val, index) => {
            return {name: avail.parameters[index], value: val}
          })
          preset.effects[uuidv4()] = {name: fx.name, parameters: params}
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

    const list = Object.entries(currentPreset.effects).map(([k, v], i) => {
      return k
    })

    const index = list.findIndex(el => el === fxId)

    const params = Object.entries(currentPreset.effects[fxId].parameters).map(([k, v], i) => {
      return v["value"]
    })

    fetch('http://' + window.location.hostname + ':5396/config/' + index, {
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
