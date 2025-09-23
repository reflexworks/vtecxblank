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
  commonIconList
} from './common'

// colors
import {
  lightBlue,
  orange,
  deepPurple,
  lightGreen,
  grey,
  red,
  pink,
  yellow
} from '@mui/material/colors'

import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Icon from '@mui/material/Icon'
import Grid from '@mui/material/Grid' // v7 の新 Grid
import Paper from '@mui/material/Paper'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton' // ← 追加
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import useMediaQuery from '@mui/material/useMediaQuery'

export const ReducerContext = createContext({})
const required_icon = commonIconList.required
const any_icon = commonIconList.any

interface CommonProps {
  children?: any
  style?: any
}

/* =========================================
 * CommonProvider
 * =======================================*/
interface CommonProviderProps extends CommonProps {}
const CommonProviderSheet = (_props: CommonProviderProps) => {
  const [state, dispatch]: any = useReducer(commonReducer, commoninitialState)
  const [props]: any = useState(_props)
  const value: any = { state, dispatch }

  const max_size = MAX_BROWSER_SIZE
  const min_size = MIN_BROWSER_SIZE
  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style: any = { width: max_size, margin: '0px auto' }
  let logo_image: any = { width: 'auto' }
  if (!matches_m || commonIsMobile) {
    body_style.width = '100%'
    logo_image.width = '35%'
  }

  const errorClose = () => dispatch({ type: '_hide_error' })

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
        message={state.error.message}
      />
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid size={12}>
          <div style={{ ...body_style, marginTop: 20, paddingTop: 20 }}>
            <a href="my_page.html" style={{ color: '#000', textDecoration: 'none' }}>
              <img src="../img/logo_vt.svg" style={logo_image} />
            </a>
          </div>
        </Grid>
        <Grid size={12} sx={{ backgroundColor: '#0059B2' }} />
        <Grid size={12}>
          <Grid size={12} style={{ ...body_style, marginBottom: 80 }}>
            {props.children}
          </Grid>
        </Grid>
      </Grid>
    </ReducerContext.Provider>
  )
}
export const CommonProvider = CommonProviderSheet

/* =========================================
 * CommonContainer
 * =======================================*/
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
  const body_style: any = { width: max_size }
  if (!matches_m) body_style.width = '100%'

  const side_menu_size = 200
  const body_size = !commonIsMobile ? parseInt(MAX_BROWSER_SIZE) - side_menu_size + 'px' : '100%'

  const [is_open_mobile_menu, setIsOpenMobileMenu] = useState(false)
  const _onClickMobileMenu = () => setIsOpenMobileMenu(!is_open_mobile_menu)

  const _sideMenu = () => {
    if (commonIsMobile) {
      return (
        <List component="nav" dense={!commonIsMobile}>
          <ListItem disablePadding sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <ListItemButton onClick={_onClickMobileMenu}>
              <ListItemText primary="メニュー" />
              {is_open_mobile_menu ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </ListItemButton>
          </ListItem>
          <Collapse in={is_open_mobile_menu} timeout="auto" unmountOnExit>
            {_props.sideMenu}
          </Collapse>
        </List>
      )
    } else {
      return (
        <div style={{ display: 'table-cell', width: side_menu_size + 'px', paddingRight: '20px' }}>
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
export const CommonContainer = CommonContainerSheet

/* =========================================
 * CommonGrid
 * =======================================*/
interface CommonGridProps extends CommonProps {
  item?: any
  justify?: any
  alignItems?: any
  xs?: any
}
const CommonGridSheet = (_props: CommonGridProps) => {
  const sxAlign = {
    justifyContent: _props.justify,
    alignItems: _props.alignItems || 'flex-start'
  } as const

  if (_props.item) {
    return (
      <Grid container size={_props.xs || 12} sx={sxAlign} style={_props.style}>
        {_props.children}
      </Grid>
    )
  } else {
    return (
      <Grid container spacing={1} sx={sxAlign} style={_props.style}>
        {_props.children}
      </Grid>
    )
  }
}
export const CommonGrid = CommonGridSheet

/* =========================================
 * CommonPaper
 * =======================================*/
interface CommonPaperProps extends CommonProps {
  title?: string
}
const PaperSheet = (_props: CommonPaperProps) => {
  return (
    <Paper elevation={1} sx={{ width: '100%' }} style={_props.style}>
      <div style={{ padding: 20 }}>
        <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
          {_props.title}
        </Typography>
        {_props.children}
      </div>
    </Paper>
  )
}
export const CommonPaper = PaperSheet

/* =========================================
 * CommonStep
 * =======================================*/
interface CommonStepProps extends CommonProps {
  title?: any
  number?: number
}
const CommonStepSheet = (_props: CommonStepProps) => {
  let icon_str: string = ''
  if (_props.number === 1) icon_str = 'one'
  else if (_props.number === 2) icon_str = 'two'
  else if (_props.number) icon_str = '' + _props.number
  if (icon_str) icon_str = 'looks_' + icon_str

  const max_size = '925px'
  const min_size = MIN_BROWSER_SIZE
  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style: any = { width: max_size, margin: '0px auto' }
  if (!matches_m) body_style.width = '100%'

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
export const CommonStep = CommonStepSheet

/* =========================================
 * CommonStepper
 * =======================================*/
interface CommonStepperProps extends CommonProps {
  activeStep?: any
  steps: any
}
const CommonStepperSheet = (_props: CommonStepperProps) => {
  return (
    <Stepper
      activeStep={_props.activeStep}
      alternativeLabel
      sx={{ width: '85%', mb: 3, mx: 'auto' }}
    >
      {_props.steps.map((label: any) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
export const CommonStepper = CommonStepperSheet

/* =========================================
 * CommonForm
 * =======================================*/
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
    if (_props.onSubmit) _props.onSubmit(_e, (state && state.data) || null)
  }

  let max_size = _props.blockArea ? '80%' : '100%'
  const min_size = MIN_BROWSER_SIZE
  const matches_m = useMediaQuery('(min-width: ' + min_size + ')')
  const body_style: any = { width: max_size }
  if (!matches_m) body_style.width = '100%'

  return (
    <CommonGrid>
      <CommonGrid item justify="center">
        <form noValidate autoComplete="off" onSubmit={_onSubmit} style={body_style} id={_props.id}>
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
export const CommonForm = CommonFormSheet

/* =========================================
 * CommonInputText
 * =======================================*/
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
// --- replace the whole function from `const CommonInputTextSheet = ...` to its export

const CommonInputTextSheet = (_props: CommonInputTextProps) => {
  const { state, dispatch }: any = useContext(ReducerContext)

  // keep only what we need in local state (do NOT store the whole _props)
  const [status, setStatus] = useState<{
    error?: boolean
    helperText?: string | false
  }>({
    error: _props.error,
    helperText: _props.helperText ?? false
  })

  const saveState = (val: any) => {
    if (dispatch && _props.name) dispatch({ type: '_save_data', key: _props.name, value: val })
  }

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    let next = { ...status }

    if (_props.required) {
      const v = commonValidation('required', value)
      next.error = v.error
      next.helperText = v.error ? v.message : false
    }
    if (value && _props.validation) {
      const v = _props.validation(value)
      next.error = v.error
      next.helperText = v.error ? v.message : v.message || false
    }

    setStatus(next)
    saveState(value)
    if (_props.onChange) setTimeout(() => _props.onChange(value), 0)
  }

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (_props.onBlur) setTimeout(() => _props.onBlur(value), 0)
  }

  useEffect(() => {
    saveState(_props.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const label = (
    <span>
      {CommonRequiredMark(_props)}
      {_props.label}
    </span>
  )

  // build InputProps immutably
  const inputProps: any = { ...(_props.InputProps || {}) }
  const iconColor = _props.iconColor ?? ''
  if (_props.icon) {
    inputProps.startAdornment = (
      <InputAdornment position="start">
        <Icon color={iconColor}>{_props.icon}</Icon>
      </InputAdornment>
    )
  }

  // state → form value
  let value = _props.name && state && state.data && state.data[_props.name]
  value = value === undefined ? _props.value : value

  // prefer explicit props first, then local status
  const error = _props.error ?? status.error
  const helperText = _props.helperText ?? status.helperText

  const InputLabelProps = { ..._props.InputLabelProps, shrink: true }

  const option: any = {
    id: _props.id,
    label,
    value,
    variant: _props.variant,
    InputProps: inputProps,
    error,
    helperText,
    type: _props.type,
    style: _props.style,
    disabled: _props.disabled,
    placeholder: _props.placeholder,
    inputRef: _props.inputRef,
    select: _props.select,
    InputLabelProps,
    SelectProps: _props.select ? { native: true } : undefined,
    autoComplete: _props.autoComplete,
    rows: _props.rows,
    multiline: _props.multiline,
    onChange: _onChange,
    onBlur: _onBlur,
    sx: { width: '100%', mb: 3, bgcolor: '#fff' }
  }

  const child = _props.child
  return CommonOverall(TextField, option, _props, child)
}
export const CommonInputText = CommonInputTextSheet

/* =========================================
 * CommonButton
 * =======================================*/
interface CommonButtonProps extends CommonInputProps {
  color?: any
  iconType?: string
  type?: any
  size?: any
  href?: string
  variant?: any
  component?: any
}
// --- replace the whole function from `const CommonButtonSheet = ...` to its export

const CommonButtonSheet = (_props: CommonButtonProps) => {
  const baseStyle = _props.style || {}
  const color = _props.color ?? 'inherit'
  // default variant rule: if color not specified -> outlined, otherwise keep/contained
  const variant = _props.variant ?? (color === 'inherit' ? 'outlined' : 'contained')

  const styles: any = { ...baseStyle }
  const color_size = 700

  if (!_props.disabled) {
    if (color === 'orange') {
      styles.color = '#fff'
      styles.backgroundColor = orange[color_size]
    }
    if (color === 'green') {
      styles.color = '#fff'
      styles.backgroundColor = lightGreen[color_size]
    }
    if (color === 'red') {
      styles.color = '#fff'
      styles.backgroundColor = red[color_size]
    }
    if (color === 'white') {
      styles.color = '#fff'
    }
  } else {
    if (color) styles.color = '#ccc'
  }

  const _onClick = (e: any) => {
    if (_props.onClick) _props.onClick(e)
  }

  const iconType = _props.iconType ?? 'left'

  const option: any = {
    variant,
    color,
    onClick: _onClick,
    type: _props.type || 'button',
    size: _props.size,
    style: styles,
    href: _props.href,
    disabled: _props.disabled,
    component: _props.component
  }

  const child: any[] = []
  if (_props.icon && iconType === 'left') child.push(<Icon sx={{ mr: 1 }}>{_props.icon}</Icon>)
  child.push(_props.children)
  if (_props.icon && iconType === 'right') child.push(<Icon sx={{ ml: 1 }}>{_props.icon}</Icon>)

  return CommonOverall(Button, option, _props, child)
}
export const CommonButton = CommonButtonSheet

/* =========================================
 * CommonText
 * =======================================*/
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
  const style: any = { ...(_props.style || {}) }

  // title variations without mutating props
  const isTitle = !!_props.title
  if (isTitle) {
    style.marginTop = 10
    style.marginBottom = 20
    style.width = '100%'
  }

  // color helpers
  if (_props.color === 'green') style.color = lightGreen[800]
  if (_props.color === 'gray') style.color = grey[500]
  if (_props.color === 'red') style.color = red[500]
  if (_props.color === 'blue') style.color = lightBlue[500]
  if (_props.disabled) style.color = grey[400]

  // choose variant immutably
  let variant: any = 'body2'
  if (_props.h1) variant = 'h1'
  else if (_props.h2) variant = 'h2'
  else if (_props.h3) variant = 'h3'
  else if (_props.h4) variant = 'h4'
  else if (_props.h5 || isTitle) variant = 'h5'
  else if (_props.h6) variant = 'h6'
  else if (_props.body) variant = 'body1'
  else if (_props.overline) variant = 'overline'
  else if (_props.caption) variant = 'caption'

  if (_props.block) {
    style.background = lightBlue[900]
    style.padding = '5px 10px'
    style.color = '#fff'
  }
  if (_props.tableHeader) {
    style.background = grey[200]
    style.padding = '7px 15px'
    style.color = grey[800]
    style.borderLeft = '3px solid ' + orange[700]
    style.borderBottom = '1px solid ' + grey[300]
    variant = 'subtitle1'
  }
  if (_props.info) style.paddingBottom = '5px'
  if (_props.opacity) style.opacity = _props.opacity
  if (_props.bold) style.fontWeight = 'bold'

  const styles = { ...style, wordWrap: 'break-word' }

  const option = {
    variant,
    color: _props.color,
    gutterBottom: true,
    style: styles,
    align: _props.align,
    inline: _props.inline,
    noWrap: _props.noWrap
  }

  let child = _props.children
  if (typeof child === 'string') {
    const lines = child.split('\n')
    if (lines.length > 1) {
      child = lines.map((v, i) => {
        const value = v === '' ? '　' : v
        return (
          <div style={styles} key={i}>
            <Typography {...option}>{value}</Typography>
          </div>
        )
      })
      return <>{child}</>
    }
  }
  return CommonOverall(Typography, option, _props, child)
}
export const CommonText = CommonTextSheet

/* =========================================
 * CommonLink
 * =======================================*/
interface CommonLinkProps extends CommonInputProps {
  color?: any
  href?: string
}
const CommonLinkSheet = (_props: CommonLinkProps) => {
  const style = { ...(_props.style || {}), cursor: 'pointer' }
  const option = {
    href: _props.href,
    color: _props.color,
    style,
    onClick: () => _props.onClick()
  }
  const child = _props.children
  return CommonOverall(Link, option, _props, child)
}
export const CommonLink = CommonLinkSheet

/* =========================================
 * CommonLabel
 * =======================================*/
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

export const IconTextGroup = (_props: any) => (
  <div style={{ display: 'table', height: '30px', marginBottom: '30px' }}>{_props.children}</div>
)

export const IconText = (_props: any) => (
  <div style={{ display: 'table-' + (commonIsMobile ? 'row' : 'cell'), verticalAlign: 'middle' }}>
    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
      <Icon color={_props.iconColor}>{_props.icon}</Icon>
    </div>
    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{_props.children}</div>
  </div>
)

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
              _props.children.map((_child: any, i: number) => (
                <Grid size={{ xs, sm }} key={i}>
                  {_child}
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>{_props.children}</Grid>
            )}
          </Grid>
        )}
      </div>
    </div>
  )
}
export const CommonGroup = CommonGroupSheet

/* =========================================
 * Tooltip / Label / Checkbox / Box
 * =======================================*/
interface CommonTooltipProps extends CommonProps {
  title?: any
  placement?: any
}
const CommonTooltipSheet = (_props: CommonTooltipProps) => (
  <Tooltip title={_props.title} placement={_props.placement || 'bottom'}>
    {_props.children}
  </Tooltip>
)
export const CommonTooltip = CommonTooltipSheet

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

  let color: any = _props.color || grey[400]
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
export const CommonLabel = CommonLabelSheet

interface CommonCheckProps extends CommonInputProps {
  color?: any
  checked?: boolean
  indeterminate?: boolean
}
const CommonCheckboxSheet = (_props: CommonCheckProps) => {
  const { state, dispatch }: any = useContext(ReducerContext)
  const saveState = (_value: any) => {
    if (dispatch && _props.name) dispatch({ type: '_save_data', key: _props.name, value: _value })
  }
  const _onChange = (_e: any) => {
    const value = _e.target.checked
    saveState(value)
    if (_props.onChange) setTimeout(() => _props.onChange(value), 0)
  }

  let checked: boolean = false
  if (_props.checked === undefined)
    checked = (_props.name && state && state.data && state.data[_props.name]) || false
  else checked = _props.checked

  const check_props: any = {
    name: _props.name,
    checked,
    onChange: _onChange,
    value: _props.value,
    color: _props.color || 'primary'
  }
  if (_props.icon) check_props.icon = <Icon>{_props.icon}</Icon>

  const checkbox = <Checkbox {...check_props} />
  const option = { control: checkbox, label: _props.children, disabled: _props.disabled }
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
export const CommonCheckbox = CommonCheckboxSheet

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
  styles.width = _props.width || '100%'

  const setSize = (_size: number) => _size * 5 + 'px'
  if (_props.top) styles.marginTop = setSize(_props.top)
  if (_props.left) styles.marginLeft = setSize(_props.left)
  if (_props.right) styles.marginRight = setSize(_props.right)
  if (_props.bottom) styles.marginBottom = setSize(_props.bottom)
  if (_props.border) {
    styles.padding = '10px'
    styles.border = '1px solid #eee'
  }

  return <div style={styles}>{_props.children}</div>
}
export const CommonBox = CommonBoxSheet

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
