
import { combineReducers } from 'redux'

// Application Reducers
import routeserversReducer
  from 'components/routeservers/reducer'

import modalsReducer
  from 'components/modals/reducer'

import errorsReducer
  from 'components/errors/reducer'

import configReducer
  from 'components/config/reducer'

import contentReducer
  from 'components/content/reducer'

import lookupReducer
	from 'components/lookup/reducer'

import routesReducer
  from 'components/routeservers/routes/reducer'

export default combineReducers({
  routeservers:  routeserversReducer,
  routes:        routesReducer,
  modals:        modalsReducer,
	lookup:				 lookupReducer,
  errors:        errorsReducer,
  config:        configReducer,
  content:       contentReducer,
});
