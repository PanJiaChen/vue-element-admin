import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import loginAPI from './login';
import articleAPI from './article';
import article_tableAPI from './article_table';
import remoteSearchAPI from './remoteSearch';
const mock = new MockAdapter(axios);

// 登录相关
mock.onPost('/login/loginbyemail').reply(loginAPI.loginByEmail);
mock.onPost('/login/logout').reply(loginAPI.logout);
mock.onGet('/user/info').reply(loginAPI.getInfo);

// 文章相关
mock.onGet('/article/list').reply(articleAPI.getList);
mock.onGet('/article/detail').reply(articleAPI.getArticle);

// table example相关
mock.onGet('/article_table/list').reply(article_tableAPI.getList);
mock.onGet('/article_table/pv').reply(article_tableAPI.getPv);

// 搜索相关
mock.onGet('/search/user').reply(remoteSearchAPI.searchUser);


export default mock;
