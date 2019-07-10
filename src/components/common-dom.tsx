import * as React from 'react'
import { useState, createContext, useReducer, useContext, useEffect } from 'react'

import {
  MAX_BROWSER_SIZE,
  MIN_BROWSER_SIZE,
  commonReducer,
  commoninitialState,
  commonValidation,
  commonSessionStorage,
  commonIsMobile,
  commonIconList,
} from './common'

import lightBlue from '@material-ui/core/colors/lightBlue'
import orange from '@material-ui/core/colors/orange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import lightGreen from '@material-ui/core/colors/lightGreen'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'
import yellow from '@material-ui/core/colors/yellow'

import { withStyles } from '@material-ui/core/styles'

import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'

import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'

import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import useMediaQuery from '@material-ui/core/useMediaQuery'

export const ReducerContext = createContext({})
const required_icon = commonIconList.required
const any_icon = commonIconList.any

interface CommonProps {
  children?: any
  classes?: any
  style?: any
}

interface CommonProviderProps extends CommonProps {}
const CommonProviderSheet = (_props: CommonProviderProps) => {
  const [state, dispatch]: any = useReducer(commonReducer, commoninitialState)
  const [props]: any = useState(_props)

  const value: any = { state, dispatch }

  const max_size = MAX_BROWSER_SIZE
  const min_size = MIN_BROWSER_SIZE
  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style = { width: max_size, margin: '0px auto' }
  let logo_image = { width: 'auto' }
  if (!matches_m || commonIsMobile) {
    body_style.width = '100%'
    logo_image.width = '35%'
  }

  const errorClose = () => {
    dispatch({ type: '_hide_error' })
  }

  //pathname
  if (location.pathname !== '/login.html') {
    commonSessionStorage.set('prev_location', location)
  }

  return (
    <ReducerContext.Provider value={value}>
      {state.indicator && (
        <div style={{ width: '100%', position: 'fixed', zIndex: 100000, top: 0, left: 0 }}>
          <LinearProgress />
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={state.error.is_open}
        onClose={errorClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={state.error.message}
      />
      <Grid className={props.classes.root} container spacing={1}>
        <Grid item xs={12}>
          <div style={body_style} className={props.classes.body}>
            <a href="my_page.html" style={{ color: '#000', textDecoration: 'none' }}>
              <img src="../img/logo_vt.svg" style={logo_image} />
            </a>
          </div>
        </Grid>
        <Grid item xs={12} className={props.classes.header}>
        </Grid>
        <Grid item xs={12} className={props.classes.body}>
          <Grid item xs={12} style={{ ...body_style, marginBottom: 80 }}>
            {props.children}
          </Grid>
        </Grid>
      </Grid>
    </ReducerContext.Provider>
  )
}
const CommonProviderStyles = () => ({
  root: {
    flexGrow: 1
  },
  header: {
    backgroundColor: '#0059B2'
  },
  header_content: {},
  body: {
    marginTop: 20,
    paddingTop: 20
  }
})
export const CommonProvider = withStyles(CommonProviderStyles)(CommonProviderSheet)

interface CommonContainerProps extends CommonProps {
  pageTitle?: string
  header?: any
  sideMenu?: any
  title?: string
}
const CommonContainerSheet = (_props: CommonContainerProps) => {
  const max_size = '100%'
  const min_size = MIN_BROWSER_SIZE

  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style = { width: max_size }
  if (!matches_m) {
    body_style.width = '100%'
  }

  const side_menu_size = 200
  const body_size = !commonIsMobile ? parseInt(MAX_BROWSER_SIZE) - side_menu_size + 'px' : '100%'

  const [is_open_mobile_menu, setIsOpenMobileMenu]: any = useState(false)
  const _onClickMobileMenu = () => {
    setIsOpenMobileMenu(!is_open_mobile_menu)
  }

  const _sideMenu = () => {
    if (commonIsMobile) {
      return (
        <List component="nav" className={_props.classes.root} dense={!commonIsMobile}>
          <ListItem
            button
            onClick={() => _onClickMobileMenu()}
            style={{ borderBottom: '1px solid #eee' }}
          >
            <ListItemText primary="メニュー" />
            {is_open_mobile_menu ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
          </ListItem>
          <Collapse in={is_open_mobile_menu} timeout="auto" unmountOnExit>
            {_props.sideMenu}
          </Collapse>
        </List>
      )
    } else {
      return (
        <div
          style={{
            display: 'table-cell',
            width: side_menu_size + 'px',
            paddingRight: '20px'
          }}
        >
          {_props.sideMenu}
        </div>
      )
    }
  }
  return (
    <div style={body_style}>
      {_props.pageTitle && (
        <CommonText h6 style={{ width: '100%' }}>
          {_props.pageTitle}
        </CommonText>
      )}
      {_props.header && <div style={{ marginBottom: '20px' }}>{_props.header}</div>}
      <div style={{ display: 'table-row' }}>
        {_props.sideMenu && _sideMenu()}
        <div style={{ display: 'table-cell', width: body_size, verticalAlign: 'top' }}>
          {_props.title && <CommonText title>{_props.title}</CommonText>}
          {_props.children}
        </div>
      </div>
    </div>
  )
}

const CommonContainerStyles = () => ({})
export const CommonContainer = withStyles(CommonContainerStyles)(CommonContainerSheet)

interface CommonGridProps extends CommonProps {
  item?: any
  justify?: any
  alignItems?: any
  xs?: any
}
const CommonGridSheet = (_props: CommonGridProps) => {
  if (_props.item) {
    return (
      <Grid
        item
        xs={_props.xs || 12}
        sm={_props.xs ? false : true}
        container
        className={_props.classes.item}
        justify={_props.justify}
        alignItems={_props.alignItems || 'flex-start'}
        style={_props.style}
      >
        {_props.children}
      </Grid>
    )
  } else {
    return (
      <Grid
        className={_props.classes.root}
        container
        spacing={1}
        style={_props.style}
        justify={_props.justify}
        alignItems={_props.alignItems || 'flex-start'}
      >
        {_props.children}
      </Grid>
    )
  }
}
const CommonGridStyles = () => ({
  root: {
    flexGrow: 1
  },
  item: {
    flexGrow: 1
  }
})
export const CommonGrid = withStyles(CommonGridStyles)(CommonGridSheet)

interface CommonPaperProps extends CommonProps {
  title?: string
}
const PaperSheet = (_props: CommonPaperProps) => {
  return (
    <Paper className={_props.classes.root} elevation={1} style={_props.style}>
      <div style={{ padding: 20 }}>
        <Typography variant="h6" component="h4" className={_props.classes.title}>
          {_props.title}
        </Typography>
        {_props.children}
      </div>
    </Paper>
  )
}
const CommonPaperStyles = () => ({
  root: {
    width: '100%'
  },
  title: {
    marginBottom: 20
  }
})
export const CommonPaper = withStyles(CommonPaperStyles)(PaperSheet)

interface CommonStepProps extends CommonProps {
  title?: any
  number?: number
}
const CommonStepSheet = (_props: CommonStepProps) => {
  let icon_str: string = ''
  if (_props.number === 1) {
    icon_str = 'one'
  } else if (_props.number === 2) {
    icon_str = 'two'
  } else if (_props.number) {
    icon_str = '' + _props.number
  }
  if (icon_str) {
    icon_str = 'looks_' + icon_str
  }

  const max_size = '925px'
  const min_size = MIN_BROWSER_SIZE

  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style = { width: max_size, margin: '0px auto' }
  if (!matches_m) {
    body_style.width = '100%'
  }

  return (
    <div style={{ marginTop: '50px' }}>
      <CommonGrid>
        <CommonGrid item justify="center">
          <label style={{ display: 'inline-flex', width: '100%', verticalAlign: 'middle' }}>
            <Icon fontSize="large" color="primary">
              {icon_str}
            </Icon>
            <CommonText
              h5
              style={{
                width: '100%',
                marginBottom: 20,
                display: 'inline-flex',
                paddingTop: 2,
                marginLeft: 5
              }}
              color="primary"
            >
              {_props.title}
            </CommonText>
          </label>
          <div style={body_style}>{_props.children}</div>
        </CommonGrid>
      </CommonGrid>
    </div>
  )
}
const CommonStepStyles = () => ({})
export const CommonStep = withStyles(CommonStepStyles)(CommonStepSheet)

interface CommonStepperProps extends CommonProps {
  activeStep?: any
  steps: any
}
const CommonStepperSheet = (_props: CommonStepperProps) => {
  return (
    <Stepper className={_props.classes.container} activeStep={_props.activeStep} alternativeLabel>
      {_props.steps.map((label: any) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
const CommonStepperStyles = () => ({
  container: { width: '85%', marginBottom: 30, margin: '0px auto' }
})
export const CommonStepper = withStyles(CommonStepperStyles)(CommonStepperSheet)

interface CommonFormProps extends CommonProps {
  onSubmit?: any
  id?: string
  inputAlertText?: boolean
  blockArea?: boolean
}
const CommonFormSheet = (_props: CommonFormProps) => {
  const { state }: any = useContext(ReducerContext)

  const _onSubmit = (_e: any) => {
    _e.preventDefault()
    if (_props.onSubmit) {
      _props.onSubmit(_e, (state && state.data) || null)
    }
  }

  let max_size = _props.blockArea ? '80%' : '100%'
  const min_size = MIN_BROWSER_SIZE

  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style = { width: max_size }
  if (!matches_m) {
    body_style.width = '100%'
  }

  return (
    <CommonGrid>
      <CommonGrid item justify="center">
        <form
          className={_props.classes.container}
          noValidate
          autoComplete="off"
          onSubmit={(_e: any) => _onSubmit(_e)}
          style={body_style}
          id={_props.id}
        >
          {_props.inputAlertText && (
            <IconTextGroup>
              <IconText icon={required_icon} iconColor="secondary">
                <CommonText>は必須入力の項目です。</CommonText>
              </IconText>
              <IconText icon={any_icon} iconColor="action">
                <CommonText>は任意入力の項目です。</CommonText>
              </IconText>
            </IconTextGroup>
          )}
          {_props.children}
        </form>
      </CommonGrid>
    </CommonGrid>
  )
}
const CommonFormStyles = () => ({
  container: {}
})
export const CommonForm = withStyles(CommonFormStyles)(CommonFormSheet)

/**
 * フォーム系のコンポーネントをまとめる
 * @param Component コンポーネント
 * @param _option コンポーネント自身のprops
 * @param __props 共通コンポーネントのprops
 * @param _children コンポーネントの子要素
 */
const CommonOverall = (Component: any, _option: any, __props: any, _children: any) => {
  const { state }: any = useContext(ReducerContext)
  let res = Component
  if (state.indicator) {
    res = (
      <Component {..._option} disabled={true}>
        {_children}
      </Component>
    )
  } else {
    res = <Component {..._option}>{_children}</Component>
  }
  if (__props.tooltip) {
    return (
      <CommonTooltip title={__props.tooltip} placement={__props.tooltip_placement}>
        {res}
      </CommonTooltip>
    )
  } else {
    return res
  }
}

interface CommonLabelProps extends CommonProps {
  color?: string
  size?: string
  inline?: boolean
  type?: string
  full?: boolean
}
const CommonLabelSheet = (_props: CommonLabelProps) => {
  const styles: any = {
    marginRight: '10px',
    padding: '5px 10px',
    color: '#fff',
    fontSize: _props.size === 'large' ? '13px' : '10px',
    borderRadius: '5px'
  }
  if (_props.inline) styles.marginLeft = '-8px'

  let color = _props.color || grey[400]

  const value = _props.children

  if (color === 'red') color = red[600]
  if (color === 'orange') color = orange[600]
  if (color === 'green') color = lightGreen[600]
  if (color === 'pink') color = pink[400]
  if (color === 'purple') color = deepPurple[400]
  if (color === 'blue') color = lightBlue[400]
  if (color === 'lightBlue') {
    color = lightBlue[100]
    styles.color = lightBlue[700]
    styles.fontWeight = 'bold'
  }
  if (color === 'lightYellow') {
    color = yellow[300]
    styles.color = yellow[900]
    styles.fontWeight = 'bold'
  }
  if (color === 'lightRed') {
    color = red[100]
    styles.color = red[700]
    styles.fontWeight = 'bold'
  }

  if (_props.full) {
    styles.display = 'block'
    styles.width = '100%'
    styles.textAlign = 'center'
  }
  return <span style={{ ...styles, background: color }}>{value}</span>
}
const CommonLabelStyles = () => ({})
export const CommonLabel = withStyles(CommonLabelStyles)(CommonLabelSheet)

const CommonRequiredMark = (_props: any, _is_group?: boolean) => {
  let mark: any = null
  const size = !_is_group ? 'middle' : 'large'
  if (!_props.transparent) {
    if (_props.required) {
      if (_props.requiredLabel !== false) {
        mark = (
          <CommonLabel size={size} color="red">
            必須
          </CommonLabel>
        )
      }
    } else {
      mark = <CommonLabel size={size}>任意</CommonLabel>
    }
  }
  if (_props.contract) {
    mark = (
      <span>
        {mark}
        <CommonLabel size={size} color="orange" inline>
          契約
        </CommonLabel>
      </span>
    )
  }
  return mark
}

export const IconTextGroup = (_props: any) => {
  return (
    <div style={{ display: 'table', height: '30px', marginBottom: '30px' }}>{_props.children}</div>
  )
}
export const IconText = (_props: any) => {
  return (
    <div style={{ display: 'table-' + (commonIsMobile ? 'row' : 'cell'), verticalAlign: 'middle' }}>
      <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
        <Icon color={_props.iconColor}>{_props.icon}</Icon>
      </div>
      <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{_props.children}</div>
    </div>
  )
}

const groupTitle = (_props: any) => {
  if (_props.transparent) {
    return <CommonText style={{ color: grey[700] }}>{_props.label}</CommonText>
  }
  return (
    <div>
      <CommonText style={{ color: grey[700] }}>
        {CommonRequiredMark(_props, true)}
        {_props.label}
      </CommonText>
      {_props.error && (
        <CommonText caption color="secondary">
          必須項目です。
        </CommonText>
      )}
    </div>
  )
}

interface CommonGroupProps extends CommonInputProps {
  col?: number
}
const CommonGroupSheet = (_props: CommonGroupProps) => {
  const len = _props.children.length
  let xs: any = 4
  let sm: any = 3
  if (len === 3 || len === 2) {
    xs = 6
    sm = 4
  }

  if (_props.col === 2) {
    xs = 12
    sm = 6
  }

  if (_props.col === 3) {
    xs = 6
    sm = 4
  }

  if (_props.col === 4) {
    xs = 4
    sm = 3
  }

  const is_single = _props.col === 1

  return (
    <div
      style={{
        backgroundColor: is_single ? '#fff' : '#EDF7FA',
        marginBottom: '20px',
        width: '100%',
        border: is_single ? '1px solid #eee' : '0px'
      }}
    >
      <div style={{ padding: is_single ? '10px' : '20px' }}>
        {groupTitle(_props)}
        {is_single && <div style={{ marginTop: '10px' }}>{_props.children}</div>}
        {!is_single && (
          <Grid container spacing={1}>
            {_props.children.map ? (
              _props.children.map((_child: any) => {
                return (
                  <Grid item xs={xs} sm={sm}>
                    {_child}
                  </Grid>
                )
              })
            ) : (
              <Grid item xs={12}>
                {_props.children}
              </Grid>
            )}
          </Grid>
        )}
      </div>
    </div>
  )
}
const CommonGroupStyles = () => ({})
export const CommonGroup = withStyles(CommonGroupStyles)(CommonGroupSheet)

interface CommonTooltipProps extends CommonProps {
  title?: any
  placement?: any
}
const CommonTooltipSheet = (_props: CommonTooltipProps) => {
  return (
    <Tooltip title={_props.title} placement={_props.placement || 'bottom'}>
      {_props.children}
    </Tooltip>
  )
}
const CommonTooltipStyles = () => ({})
export const CommonTooltip = withStyles(CommonTooltipStyles)(CommonTooltipSheet)

interface CommonInputProps extends CommonProps {
  tooltip?: any
  tooltip_placement?: any
  label?: string
  required?: boolean
  contract?: boolean
  error?: boolean
  transparent?: boolean
  value?: string
  name?: string
  helperText?: string
  id?: string
  requiredLabel?: boolean
  readOnly?: boolean
  icon?: any
  iconColor?: any
  disabled?: any
  placeholder?: any
  onBlur?: any
  onClick?: any
  onChange?: any
}

interface CommonInputTextProps extends CommonInputProps {
  validation?: any
  type?: string
  variant?: any
  inputRef?: any
  select?: boolean
  child?: any
  data?: any
  InputLabelProps?: any
  autoComplete?: any
  rows?: number
  multiline?: boolean
  InputProps?: any
}
const CommonInputTextSheet = (_props: CommonInputTextProps) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const [props, setProps]: any = useState(_props)

  const saveState = (_value: any) => {
    if (dispatch && _props.name) {
      dispatch({ type: '_save_data', key: _props.name, value: _value })
    }
  }

  const _onChange = (_e: any) => {
    const value = _e.target.value

    if (_props.required) {
      // 必須チェック
      const validation = commonValidation('required', value)
      props.error = validation.error
      props.helperText = validation.error ? validation.message : false
    }
    if (value && _props.validation) {
      // その他のチェック
      const validation = _props.validation(value)
      props.error = validation.error
      props.helperText = validation.error ? validation.message : validation.message || false
    }

    setProps(props)

    saveState(value)

    if (_props.onChange) {
      setTimeout(() => {
        _props.onChange(value)
      }, 0)
    }
  }
  const _onBlur = (_e: any) => {
    const value = _e.target.value
    if (_props.onBlur) {
      setTimeout(() => {
        _props.onBlur(value)
      }, 0)
    }
  }

  useEffect(() => {
    saveState(_props.value)
  }, [])

  const label = (
    <span>
      {CommonRequiredMark(_props)}
      {_props.label}
    </span>
  )

  const input_props: any = _props.InputProps || {}
  if (_props.readOnly) {
    input_props.readOnly = _props.readOnly
  }
  if (_props.icon) {
    _props.iconColor = _props.iconColor || ''
    input_props.startAdornment = (
      <InputAdornment position="start">
        <Icon color={_props.iconColor}>{_props.icon}</Icon>
      </InputAdornment>
    )
  }
  let value = _props.name && state && state.data && state.data[_props.name]
  value = !value && value !== '' ? _props.value : value
  const error = !_props.error && _props.error === false ? _props.error : props.error || _props.error
  const helperText =
    !_props.helperText && _props.helperText === ''
      ? _props.helperText
      : props.helperText || _props.helperText

  if (!_props.InputLabelProps) _props.InputLabelProps = {}
  _props.InputLabelProps.shrink = true

  const option = {
    id: _props.id,
    label: label,
    className: _props.classes.textField,
    value: value,
    variant: _props.variant,
    InputProps: input_props,
    error: error,
    helperText: helperText,
    type: _props.type,
    style: _props.style,
    disabled: _props.disabled,
    placeholder: _props.placeholder,
    inputRef: _props.inputRef,
    select: _props.select,
    InputLabelProps: _props.InputLabelProps,
    SelectProps: _props.select
      ? {
          native: true
        }
      : false,
    autoComplete: _props.autoComplete,
    rows: _props.rows,
    multiline: _props.multiline,
    onChange: (_e: any) => _onChange(_e),
    onBlur: (_e: any) => _onBlur(_e)
  }

  const child = _props.child

  return CommonOverall(TextField, option, _props, child)
}
const CommonInputTextStyles = () => ({
  textField: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#fff'
  }
})
export const CommonInputText = withStyles(CommonInputTextStyles)(CommonInputTextSheet)

interface CommonButtonProps extends CommonInputProps {
  color?: any
  iconType?: string
  type?: any
  size?: any
  href?: string
  variant?: any
  component?: any
}
const CommonButtonSheet = (_props: CommonButtonProps) => {
  let styles = _props.style || {}
  if (!_props.color) {
    _props.color = 'inherit'
    _props.variant = 'outlined'
  }

  const color_size = 700
  if (!_props.disabled) {
    if (_props.color === 'orange') {
      styles.color = '#fff'
      styles.backgroundColor = orange[color_size]
    }
    if (_props.color === 'green') {
      styles.color = '#fff'
      styles.backgroundColor = lightGreen[color_size]
    }
    if (_props.color === 'red') {
      styles.color = '#fff'
      styles.backgroundColor = red[color_size]
    }
    if (_props.color === 'white') {
      styles.color = '#fff'
    }
  } else {
    if (_props.color) {
      styles.color = '#ccc'
    }
  }

  const variant = _props.variant || _props.variant === null ? _props.variant : 'contained'

  const _onClick = (_e: any) => {
    if (_props.onClick) {
      _props.onClick(_e)
    }
  }

  if (!_props.iconType) {
    _props.iconType = 'left'
  }

  const option = {
    variant: variant,
    color: _props.color,
    className: _props.classes.button,
    onClick: (_e: any) => _onClick(_e),
    type: _props.type || 'button',
    size: _props.size,
    style: styles,
    href: _props.href,
    disabled: _props.disabled,
    component: _props.component
  }

  let child = []
  if (_props.icon && _props.iconType === 'left') {
    child.push(<Icon className={_props.classes.leftIcon}>{_props.icon}</Icon>)
  }
  child.push(_props.children)
  if (_props.icon && _props.iconType === 'right') {
    child.push(<Icon className={_props.classes.rightIcon}>{_props.icon}</Icon>)
  }
  return CommonOverall(Button, option, _props, child)
}
const CommonButtonStyles = (theme: any) => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  }
})
export const CommonButton = withStyles(CommonButtonStyles)(CommonButtonSheet)

interface CommonTextProps extends CommonInputProps {
  color?: any
  align?: any
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
  body?: boolean
  overline?: boolean
  caption?: boolean
  inline?: boolean
  noWrap?: boolean
  title?: boolean
  block?: boolean
  label?: any
  info?: boolean
  tableHeader?: boolean
  opacity?: number
  bold?: boolean
}
const CommonTextSheet = (_props: CommonTextProps) => {
  if (!_props.style) _props.style = {}

  if (_props.title) {
    _props.h5 = true
    _props.style = { marginTop: 10, marginBottom: 20, width: '100%' }
  }
  if (_props.label) {
    _props.style = { fontSize: '12px', color: '#757575' }
  }

  if (_props.color === 'green') {
    _props.style.color = lightGreen[800]
  }
  if (_props.color === 'gray') {
    _props.style.color = grey[500]
  }
  if (_props.color === 'red') {
    _props.style.color = red[500]
  }
  if (_props.color === 'blue') {
    _props.style.color = lightBlue[500]
  }

  let _variant: any = 'body2'
  if (_props.h1) _variant = 'h1'
  if (_props.h2) _variant = 'h2'
  if (_props.h3) _variant = 'h3'
  if (_props.h4) _variant = 'h4'
  if (_props.h5) _variant = 'h5'
  if (_props.h6) _variant = 'h6'
  if (_props.body) _variant = 'body'
  if (_props.overline) _variant = 'overline'
  if (_props.caption) _variant = 'caption'
  if (_props.disabled) {
    _props.style.color = grey[400]
  }

  if (_props.block) {
    _props.style.background = lightBlue[900]
    _props.style.padding = '5px 10px'
    _props.style.color = '#fff'
  }

  if (_props.tableHeader) {
    _props.style.background = grey[200]
    _props.style.padding = '7px 15px'
    _props.style.color = grey[800]
    _props.style.borderLeft = '3px solid ' + orange[700]
    _props.style.borderBottom = '1px solid ' + grey[300]
    _variant = 'subtitle1'
  }

  if (_props.info) {
    _props.style.paddingBottom = '5px'
  }

  if (_props.opacity) {
    _props.style.opacity = _props.opacity
  }
  if (_props.bold) {
    _props.style.fontWeight = 'bold'
  }

  const styles = {
    ..._props.style,
    wordWrap: 'break-word'
  }
  const option = {
    variant: _variant,
    color: _props.color,
    gutterBottom: true,
    style: styles,
    align: _props.align,
    inline: _props.inline,
    noWrap: _props.noWrap
  }
  let child = _props.children
  if (child && child.split) {
    const childs = _props.children.split('\n')
    if (childs.length > 1) {
      child = _props.children.split('\n').map((_value: string) => {
        const value = _value === '' ? '　' : _value
        return (
          <div style={styles}>
            <Typography {...option}>{value}</Typography>
          </div>
        )
      })
    }
  }
  return CommonOverall(Typography, option, _props, child)
}
const CommonTextStyles = () => ({})
export const CommonText = withStyles(CommonTextStyles)(CommonTextSheet)

interface CommonLinkProps extends CommonInputProps {
  color?: any
  href?: string
}
const CommonLinkSheet = (_props: CommonLinkProps) => {
  const style = _props.style || {}
  style.cursor = 'pointer'
  const option = {
    href: _props.href,
    color: _props.color,
    style: style,
    onClick: () => _props.onClick()
  }
  const child = _props.children
  return CommonOverall(Link, option, _props, child)
}
const CommonLinkStyles = () => ({})
export const CommonLink = withStyles(CommonLinkStyles)(CommonLinkSheet)

interface CommonCheckProps extends CommonInputProps {
  color?: any
  checked?: boolean
  indeterminate?: boolean
}
const CommonCheckboxSheet = (_props: CommonCheckProps) => {
  const { state, dispatch }: any = useContext(ReducerContext)

  const saveState = (_value: any) => {
    if (dispatch && _props.name) {
      dispatch({ type: '_save_data', key: _props.name, value: _value })
    }
  }
  const _onChange = (_e: any) => {
    const value = _e.target.checked
    saveState(value)
    if (_props.onChange) {
      setTimeout(() => {
        _props.onChange(value)
      }, 0)
    }
  }

  let checked: boolean = false
  if (_props.checked === undefined) {
    checked = (_props.name && state && state.data && state.data[_props.name]) || false
  } else {
    checked = _props.checked
  }

  const check_props: CommonCheckProps = {
    name: _props.name,
    checked: checked,
    onChange: (_e: any) => _onChange(_e),
    value: _props.value,
    color: _props.color || 'primary'
  }
  if (_props.icon) {
    check_props.icon = <Icon>{_props.icon}</Icon>
  }
  const checkbox = <Checkbox {...check_props} />

  const option = {
    control: checkbox,
    label: _props.children,
    disabled: _props.disabled
  }
  const dom = CommonOverall(FormControlLabel, option, _props, null)
  return _props.label ? (
    <div style={{ padding: '20px', backgroundColor: '#EDF7FA', marginBottom: '20px' }}>
      <CommonText color="primary">{_props.label}</CommonText>
      {dom}
    </div>
  ) : (
    dom
  )
}
const CommonCheckboxStyles = () => ({})
export const CommonCheckbox = withStyles(CommonCheckboxStyles)(CommonCheckboxSheet)

interface CommonBoxProps extends CommonProps {
  width?: string
  top?: number
  left?: number
  right?: number
  bottom?: number
  align?: string
  border?: boolean
}
const CommonBoxSheet = (_props: CommonBoxProps) => {
  const styles: any = {}

  if (_props.align) styles.textAlign = _props.align

  if (_props.width) {
    styles.width = _props.width
  } else {
    styles.width = '100%'
  }

  const setSize = (_size: number) => {
    return _size * 5 + 'px'
  }
  if (_props.top) {
    styles.marginTop = setSize(_props.top)
  }
  if (_props.left) {
    styles.marginLeft = setSize(_props.left)
  }
  if (_props.right) {
    styles.marginRight = setSize(_props.right)
  }
  if (_props.bottom) {
    styles.marginBottom = setSize(_props.bottom)
  }

  if (_props.border) {
    styles.padding = '10px'
    styles.border = '1px solid #eee'
  }

  return <div style={styles}>{_props.children}</div>
}
const CommonBoxStyles = () => ({})
export const CommonBox = withStyles(CommonBoxStyles)(CommonBoxSheet)
