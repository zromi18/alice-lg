
import {debounce} from "underscore"

import React from 'react'
import {connect} from 'react-redux'

import {Link} from 'react-router-dom'
import {push} from 'connected-react-router'

import Details    from '../details'
import Status     from '../status'
import PageHeader from 'components/page-header'

import {apiCacheStatus} from 'components/api-status/cache'

import ProtocolName
  from 'components/routeservers/protocols/name'

import RoutesView  from './view'

import SearchInput from 'components/search-input'

import BgpAttributesModal
  from './bgp-attributes-modal'


import RoutesLoadingIndicator from './loading-indicator'

// Actions
import {setFilterQueryValue}
  from './actions'
import {loadRouteserverProtocol}
  from 'components/routeservers/actions'


// Constants
import {ROUTES_RECEIVED,
        ROUTES_FILTERED,
        ROUTES_NOT_EXPORTED} from './actions';


const makeQueryLinkProps = function(routing, query) {
  // As we need to reset the pagination, we can just
  // ommit these parameters and just use pathname + query
  return {
    pathname: routing.pathname,
    search: `?q=${query}`
  };
}


/*
 * Check if the routes view is empty, (while nothing is,
 * loading) and show info screen.
 */
const RoutesViewEmpty = (props) => {
  const isLoading = props.routes.received.loading ||
                    props.routes.filtered.loading ||
                    props.routes.notExported.loading;

  if (isLoading) {
    return null; // We are not a loading indicator.
  }
  
  const hasContent = props.routes.received.totalResults > 0 ||
                     props.routes.filtered.totalResults > 0 ||
                     props.routes.notExported.totalResults > 0;
  if (hasContent) {
    return null; // Nothing to do then.
  }


  // Show info screen
  return (
    <div className="card info-result-empty">
      <h4>No routes found matching your query.</h4>
      <p>Please check if your query is too restrictive.</p>
    </div>
  );
}


class RoutesPage extends React.Component {
  constructor(props) {
    super(props);

    // Create debounced dispatch, as we don't want to flood
    // the server with API queries
    this.debouncedDispatch = debounce(this.props.dispatch, 350);
  }


  setFilter(value) {
    this.props.dispatch(
      setFilterQueryValue(value)
    );

    this.debouncedDispatch(push(makeQueryLinkProps(
      this.props.routing, value
    )));
  }

  componentDidMount() {
    const rsId = parseInt(this.props.match.params.routeserverId, 10);
    // Assert neighbors for RS are loaded
    this.props.dispatch(loadRouteserverProtocol(rsId));
  }

  render() {
    const rsId = this.props.match.params.routeserverId;
    const protocolId = this.props.match.params.protocolId;

    let cacheStatus = apiCacheStatus(this.props.routes.received.apiStatus);
    if (this.props.anyLoading) {
      cacheStatus = null;
    }

    return(
      <div className="routeservers-page">
        <PageHeader>
          <Link to={`/routeservers/${rsId}`}>
            <Details routeserverId={rsId} />
          </Link>
          <span className="spacer">&raquo;</span>
          <ProtocolName routeserverId={rsId}
                        protocolId={protocolId} />
        </PageHeader>

        <BgpAttributesModal />

        <div className="row details-main">
          <div className="col-md-8">

            <div className="card">
              <SearchInput
                value={this.props.filterValue}
                placeholder="Filter by Network or BGP next-hop"
                onChange={(e) => this.setFilter(e.target.value)}  />
            </div>

            <RoutesViewEmpty routes={this.props.routes} />

            <RoutesView
                type={ROUTES_FILTERED}
                routeserverId={rsId}
                protocolId={protocolId} />

            <RoutesView
                type={ROUTES_RECEIVED}
                routeserverId={rsId}
                protocolId={protocolId} />

            <RoutesView
                type={ROUTES_NOT_EXPORTED}
                routeserverId={rsId}
                protocolId={protocolId} />

            <RoutesLoadingIndicator />

          </div>
          <div className="col-md-4">
            <div className="card">
              <Status routeserverId={rsId} cacheStatus={cacheStatus} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}


export default connect(
  (state) => {
    let received = {
      loading:      state.routes.receivedLoading,
      totalResults: state.routes.receivedTotalResults,
      apiStatus:    state.routes.receivedApiStatus
    };
    let filtered = {
      loading:      state.routes.filteredLoading,
      totalResults: state.routes.filteredTotalResults,
      apiStatus:    state.routes.filteredApiStatus
    };
    let notExported = {
      loading:      state.routes.notExportedLoading,
      totalResults: state.routes.notExportedTotalResults,
      apiStatus:    state.routes.notExportedApiStatus
    };
    let anyLoading = state.routes.receivedLoading ||
                     state.routes.filteredLoading ||
                     state.routes.notExportedLoading;
    return({
      filterValue: state.routes.filterValue,
      routes: {
          [ROUTES_RECEIVED]:     received,
          [ROUTES_FILTERED]:     filtered,
          [ROUTES_NOT_EXPORTED]: notExported
      },
      routing: state.router.location,
      anyLoading: anyLoading
    });
  }
)(RoutesPage);

