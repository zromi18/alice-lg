import React   from 'react'
import Sidebar from '../components/sidebar'

import ErrorsPage from '../components/errors/page'
import Config from '../components/config/view'

import { Route, Switch } from 'react-router'


// Components
import WelcomePage
  from 'components/welcome'
import RouteserverPage
  from 'components/routeservers/page'
import RoutesPage
  from 'components/routeservers/routes/page'


export default class LayoutMain extends React.Component {
  render() {
    return (
      <div className="page">
        <ErrorsPage />
        <Sidebar />
        <div className="page-body">
          <main className="page-content">
           <Switch>
             <Route exact path="/" component={WelcomePage}/>
             <Route path="/routeservers">
                <Route path=":routeserverId" component={RouteserverPage} />
                <Route path=":routeserverId/protocols/:protocolId/routes" component={RoutesPage} />
             </Route>
           </Switch>
          </main>
        </div>
        <Config/>
      </div>
    );
  }
}

