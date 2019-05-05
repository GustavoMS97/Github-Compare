import React, { Component } from 'react';
import moment from 'moment';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';
import api from '../../services/api';
import { get, store } from '../../services/localStorage';
import logo from '../../assets/logo.png';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryInput: '',
    repositories: [],
    repositoryError: false,
  };

  componentDidMount() {
    const repositories = JSON.parse(get('repositories'));
    if (repositories) {
      this.setState({ repositories });
    } else {
      store('repositories', JSON.stringify([]));
    }
  }

  removeFromArray = (id) => {
    const { repositories } = this.state;
    const newList = repositories.filter(item => item.id !== id);
    const repositoriesLS = JSON.parse(get('repositories'));
    if (repositoriesLS) {
      store('repositories', JSON.stringify(newList));
    }
    this.setState({ repositories: newList });
  };

  updateRepositoryData = async (id, fullName) => {
    const { repositories } = this.state;
    let index;
    for (let i = 0; i < repositories.length; i += 1) {
      if (repositories[i].id === id) {
        index = i;
        break;
      }
    }
    try {
      const { data: repository } = await api.get(`/repos/${fullName}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      repositories[index] = repository;
      this.setState({ repositories: [...repositories] });
    } catch (error) {
      // console.log(error)
    }
  };

  handleAddRepository = async (e) => {
    e.preventDefault();
    const { repositoryInput, repositories } = this.state;
    this.setState({ loading: true });
    try {
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      this.setState({
        repositories: [...repositories, repository],
        repositoryInput: '',
        repositoryError: false,
      });

      const repositoriesLS = JSON.parse(get('repositories'));
      if (repositoriesLS) {
        repositoriesLS.push(repository);
        store('repositories', JSON.stringify(repositoriesLS));
      }
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      repositories, repositoryInput, repositoryError, loading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList
          repositories={repositories}
          onRemove={this.removeFromArray}
          onSync={this.updateRepositoryData}
        />
      </Container>
    );
  }
}
