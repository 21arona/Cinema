import React, { Component } from "react";
import './style.css';
import profile from "../images/a.png";
import email from "../images/email.jpg";
import pass from "../images/pass.png";
import InputComponent from "../components/input-component";
import Swal from "sweetalert2";

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      appState: 'login',
      searchTerm: '',
      films: [],
      selectedFilmId: '',
      selectedFilm:{},
    };
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSearch = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      if (value === '') {
        this.afficherFilms();
      } else {
        this.searchFilms();
      }
    });
  };
  handleSelectedFilm(idFilm) {
    
  }

  afficherFilms = async () => {
    try {
      const response = await fetch('http://localhost:8001/labo2/searchMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{}',
      });

      if (response.ok) {
        const data = await response.json();
        const films = data.films;
        this.setState({ films });
      } else {
      }
    } catch (error) {
    }
  };

  handleSubmit = async (event) => {
    const { userName, password } = this.state;

    const payload = {
      username: userName,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8001/labo2/verifyLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        this.setState({ appState: 'home' });
        this.searchFilms('');
      } else {
        await Swal.fire({ title: "Mot de passe incorrect" });
      }
    } catch (error) {
    }
  };


  searchFilms = () => {
    const { searchTerm } = this.state;
    const { films } = this.state;

    const filteredFilms = films.filter((film) => {
      const titre = film.titre.toLowerCase();
      const recherche = searchTerm.toLowerCase();

      return titre.includes(recherche);
    });
    this.setState({ films: filteredFilms });
  };

  handleFilmClick = (idFilm) => {
    this.setState({ selectedFilmId: idFilm, appState: 'details' });
    for (let index = 0; index < this.state.films.length; index++) {
      if (this.state.films[index].idFilm === idFilm) {
      this.setState({selectedFilm: this.state.films[index]});
      }
    }
  };

  handleFilmLoan = async () => {
    const { selectedFilmId } = this.state;
  
    const payload = {
      idClient: "C_245545",
      idFilm: selectedFilmId,
    };
  
    try {
      const response = await fetch("http://localhost:8001/labo2/loanMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Le film a été loué avec succès !");
      } else {
      }
    } catch (error) {
    }
  };
  
  handleGoBack = () => {
  this.setState({ appState: 'home' });
  }

  renderScreen() {
    if (this.state.appState === 'login') {
      return (
        <div className="main">
          <div className="sub-main">
            <div>
              <div className="imgs">
                <div className="container-image">
                <i class="uil uil-user user-icon"></i>
                </div>
              </div>
              <div>
                <br/>
                <br/>
                <InputComponent
                  divClassName="first-input"
                  imageSrc={email}
                  imageAlt="email"
                  imageClassName="uil uil-envelope email"
                  type="text"
                  placeholder="Username"
                  inputClassName="name"
                  onChange={this.handleInputChange}
                  name="userName"
                />
                <InputComponent
                  divClassName="second-input"
                  imageSrc={pass}
                  imageAlt="pass"
                  imageClassName="uil uil-lock email"
                  type="password"
                  placeholder="Password"
                  inputClassName="name"
                  onChange={this.handleInputChange}
                  name="password"
                />

                <div className="login-button">
                  <button type="submit" onClick={this.handleSubmit}>Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } 
    ////
    else if (this.state.appState === 'home') {
      if (this.state.films.length === 0) {
        this.afficherFilms();
        return <p>Chargement des films...</p>;
      } else {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="home-page">
            <div className='searchInput'>
              <h1>Home</h1>
              <input type="text" value={this.state.searchTerm} onChange={this.handleSearch} name="searchTerm" />
              <p>Vous recherchez : {this.state.searchTerm}</p>

              {this.state.films.length === 0 ? (
                <p>Aucun film trouvé.</p>
              ) : (
                <div className="searchContainer">
                <ul>
                  {this.state.films.map((film, index) => (
                    <li key={index} className="films" onClick={() => this.handleFilmClick(film.idFilm)}>
                      <p>id: {film.idFilm}</p>
                      <p>{film.titre}</p>
                      <p>{film.anneeSortie}</p>
                    </li>
                  ))}
                </ul>
                </div>
              )}
              </div>
            </div>
          </div>
        );
      }
    }
    ///
    else if (this.state.appState === 'details') {
     
      return (
        <div className="container">
          <div className="details">
            <h1>Details</h1>
            <h2>{this.state.selectedFilm.titre}</h2>
            <p><strong>id:</strong> {this.state.selectedFilm.idFilm}</p>
            <p><strong>Acteurs :</strong></p> 
            <p> {this.state.selectedFilm.acteurs}</p>
            <p><strong>Genres :</strong> {this.state.selectedFilm.genres}</p>
            <p><strong>Année de Sortie :</strong> {this.state.selectedFilm.anneeSortie}</p>
            <p><strong>Langage original :</strong> {this.state.selectedFilm.langueOriginale}</p>
            <p><strong>Pays de production :</strong> {this.state.selectedFilm.paysProductions}</p>
            <p><strong>Réalisateurs :</strong> {this.state.selectedFilm.realisateurs}</p>
          </div>

        <div className="buttons">
          <button className="mybutton" onClick={this.handleFilmLoan}>Louer ce film</button>
          <button className="mybutton" onClick={this.handleGoBack}>Retour</button>
        </div>
      </div>
      );
    }
  }

  render() {
    return (
      this.renderScreen()
    );
  }
}

export default FormContainer;