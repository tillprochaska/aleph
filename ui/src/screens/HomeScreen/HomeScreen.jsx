import React, { Component, PureComponent } from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import {
  defineMessages, FormattedMessage, FormattedNumber,
} from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, ControlGroup, Intent } from '@blueprintjs/core';
import SearchBox from 'src/components/Navbar/SearchBox';

import { fetchStatistics } from 'src/actions/index';
import { selectMetadata, selectStatistics } from 'src/selectors';
import Screen from 'src/components/Screen/Screen';
import c from 'classnames';
import './HomeScreen.scss';
import { translatableConnected } from 'src/util/enhancers';
import DualPane from '../../components/common/DualPane';
import { Category, Country, Schema } from '../../components/common';

const messages = defineMessages({
  title: {
    id: 'home.title',
    defaultMessage: 'Find public records and leaks',
  },
  search_placeholder: {
    id: 'home.search_placeholder',
    defaultMessage: 'Try searching: {samples}',
  },
  home_search: {
    id: 'home.search',
    defaultMessage: 'Search',
  },
});

class Statistics extends PureComponent {
  static Item({
    Name = Statistics.Name,
    Count = Statistics.Count,
    item: [name, count],
    ...rest
  }) {
    return (
      <li {...rest}>
        <Name name={name} />
        <Count count={count} />
      </li>
    );
  }

  static Name({ name }) {
    return <span>{name}</span>;
  }

  static Count({ count }) {
    return (<span><FormattedNumber value={count} /></span>);
  }

  static Noop(props) { return <div {...props}>skeleton</div>; }

  render() {
    const {
      statistic,
      headline,
      isLoading,
      children = isLoading ? Statistics.Noop : Statistics.Item,
      Name = Statistics.Name,
      Count = Statistics.Count,
    } = this.props;
    const list = isLoading ? Array(10).fill([]) : Object.entries(statistic);
    const rest = list.length - 15;
    return (
      <div className="statistic bp3-callout ">
        <h5 className={c('bp3-heading', 'statistic--headline', { 'bp3-skeleton': isLoading })}>{headline}</h5>
        <ul className="statistic--list">
          {_.sortBy(list, [1]).splice(-15).reverse().map(item => children({
            className: c('statistic--list-item', { 'bp3-skeleton': isLoading }),
            key: item.name,
            item,
            Name,
            Count,
          }))}
          {rest > 0 && children({
            className: c('statistic--list-item', { 'bp3-skeleton': isLoading }),
            item: ['and other', list.length - 15],
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  statistics: selectStatistics(state),
  metadata: selectMetadata(state),
});
export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // for now, always load
    this.props.fetchStatistics();
  }

  onChange({ target }) {
    this.setState({ value: target.value });
  }

  updateSearchValue = value => this.setState({ value });

  onSubmit = event => event.preventDefault();

  handleSearchBtn = () => this.doSearch();

  doSearch = (searchValue = this.state.value) => {
    const { history } = this.props;
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        q: searchValue,
      }),
    });
  };

  render() {
    const { intl, metadata, statistics } = this.props;
    const samples = metadata.app.samples.join(', ');

    return (
      <Screen isHomepage title={intl.formatMessage(messages.title)}>
        <section className="HomePage">
          <div className="outer-searchbox">
            <div className="inner-searchbox">
              <form onSubmit={this.onSubmit} className="search-form" autoComplete="off">
                <ControlGroup fill>
                  <SearchBox
                    id="search-box"
                    doSearch={this.doSearch}
                    updateSearchValue={this.updateSearchValue}
                    searchValue={this.state.value}
                    placeholder={intl.formatMessage(messages.search_placeholder, { samples })}
                  />
                  <Button
                    className="bp3-large bp3-fixed"
                    intent={Intent.PRIMARY}
                    onClick={this.handleSearchBtn}
                    text={intl.formatMessage(messages.home_search)}
                  />
                </ControlGroup>
              </form>
              <DualPane className="statistics-list">
                <Statistics
                  headline={(
                    <FormattedMessage
                      id="home.statistics.schemata"
                      defaultMessage="Search {things} entities"
                      values={statistics}
                    />
                  )}
                  statistic={statistics.schemata}
                  isLoading={!statistics.schemata}
                  Name={props => (
                    <span>
                      <Schema.Smart.Link
                        url={`/search?filter:schema=${props.name}`}
                        schema={props.name}
                        {...props}
                      />
                    </span>
                  )}
                />
                <Statistics
                  headline={(
                    <FormattedMessage
                      id="home.statistics.categories"
                      defaultMessage="from {collections} sources"
                      values={statistics}
                    />
                  )}
                  statistic={statistics.categories}
                  isLoading={!statistics.categories}
                  Name={props => (
                    <Link
                      to={`/sources?collectionsfilter:category=${props.name}`}
                    >
                      <Category category={props.name} />
                    </Link>
                  )}
                />
                <Statistics
                  headline={(
                    <FormattedMessage
                      id="home.statistics.countries"
                      defaultMessage="in {count} countries"
                      values={{
                        count: _.size(statistics.countries),
                      }}
                    />
                  )}
                  statistic={statistics.countries}
                  isLoading={!statistics.countries}
                  Name={props => (
                    <Link to={`/sources?collectionsfilter:countries=${props.name}`}>
                      <Country.Name {...props} code={props.name} />
                    </Link>
                  )}
                />
              </DualPane>
            </div>
          </div>
        </section>
      </Screen>
    );
  }
}

export default translatableConnected({
  mapStateToProps,
  mapDispatchToProps: { fetchStatistics },
})(HomeScreen);
