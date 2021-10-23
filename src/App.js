import Board from "./components/Board";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/header/Header";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <ProtectedRoute exact path="/" component={Board}></ProtectedRoute>
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}
export default App;
