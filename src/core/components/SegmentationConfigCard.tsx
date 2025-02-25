import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ChangeEvent } from 'react'
import {
  InputResolution,
  PipelineName,
  SegmentationBackend,
  SegmentationConfig,
  SegmentationModel,
} from '../helpers/segmentationHelper'

type SegmentationConfigCardProps = {
  config: SegmentationConfig
  isSIMDSupported: boolean
  onChange: (config: SegmentationConfig) => void
}

function SegmentationConfigCard(props: SegmentationConfigCardProps) {
  const classes = useStyles()

  function handleModelChange(event: ChangeEvent<{ value: unknown }>) {
    const model = event.target.value as SegmentationModel
    let backend = props.config.backend
    let inputResolution = props.config.inputResolution
    let pipeline = props.config.pipeline
    switch (model) {
      case 'meet':
        if (
          (backend !== 'wasm' && backend !== 'wasmSimd') ||
          (inputResolution !== '256x144' && inputResolution !== '160x96')
        ) {
          backend = props.isSIMDSupported ? 'wasmSimd' : 'wasm'
          inputResolution = '160x96'
          pipeline = 'webgl2'
        }
        break
    }
    props.onChange({
      ...props.config,
      model,
      backend,
      inputResolution,
      pipeline,
    })
  }

  function handleBackendChange(event: ChangeEvent<{ value: unknown }>) {
    props.onChange({
      ...props.config,
      backend: event.target.value as SegmentationBackend,
    })
  }

  function handleInputResolutionChange(event: ChangeEvent<{ value: unknown }>) {
    props.onChange({
      ...props.config,
      inputResolution: event.target.value as InputResolution,
    })
  }

  function handlePipelineChange(event: ChangeEvent<{ value: unknown }>) {
    props.onChange({
      ...props.config,
      pipeline: event.target.value as PipelineName,
    })
  }

  function handleTargetFpsChange(event: ChangeEvent<{ value: string }>) {
    props.onChange({
      ...props.config,
      targetFps: parseInt(event.target.value),
    })
  }

  function handleDeferInputResizingChange(
    event: ChangeEvent<{ checked: boolean }>
  ) {
    props.onChange({
      ...props.config,
      deferInputResizing: event.target.checked,
    })
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Segmentation
        </Typography>
        <div className={classes.formControls}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Model</InputLabel>
            <Select
              label="Model"
              value={props.config.model}
              onChange={handleModelChange}
            >
              <MenuItem value="meet">Meet</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Backend</InputLabel>
            <Select
              label="Backend"
              value={props.config.backend}
              onChange={handleBackendChange}
            >
              <MenuItem value="wasm">WebAssembly</MenuItem>
              <MenuItem value="wasmSimd" disabled={!props.isSIMDSupported}>
                WebAssembly SIMD
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Input resolution</InputLabel>
            <Select
              label="Input resolution"
              value={props.config.inputResolution}
              onChange={handleInputResolutionChange}
            >
              <MenuItem
                value="256x144"
                disabled={props.config.model !== 'meet'}
              >
                256x144
              </MenuItem>
              <MenuItem value="160x96" disabled={props.config.model !== 'meet'}>
                160x96
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Pipeline</InputLabel>
            <Select
              label="Pipeline"
              value={props.config.pipeline}
              onChange={handlePipelineChange}
            >
              <MenuItem value="webgl2">WebGL 2</MenuItem>
              <MenuItem value="canvas2dCpu">Canvas 2D + CPU</MenuItem>
            </Select>
          </FormControl>
          {props.config.pipeline === 'webgl2' && (
            <>
              <TextField
                className={classes.formControl}
                label="Target fps"
                type="number"
                variant="outlined"
                value={props.config.targetFps}
                onChange={handleTargetFpsChange}
              />
              <FormControlLabel
                className={classes.formControl}
                label="Defer input resizing"
                control={
                  <Switch
                    checked={props.config.deferInputResizing}
                    onChange={handleDeferInputResizingChange}
                    color="primary"
                  />
                }
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.only('md')]: {
        gridColumnStart: 2,
        gridRowStart: 2,
      },
    },
    formControls: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(2),
      minWidth: 200,
      flex: 1,
    },
  })
)

export default SegmentationConfigCard
