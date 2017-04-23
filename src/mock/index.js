import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import articleAPI from './article';
import article_tableAPI from './article_table';
import remoteSearchAPI from './remoteSearch';
const mock = new MockAdapter(axios);


mock.onGet('/article/list').reply(articleAPI.getList);
mock.onGet('/article/detail').reply(articleAPI.getArticle);

mock.onGet('/article_table/list').reply(article_tableAPI.getList);
mock.onGet('/article_table/pv').reply(article_tableAPI.getPv);


mock.onGet('/search/user').reply(remoteSearchAPI.searchUser);


export default mock;
