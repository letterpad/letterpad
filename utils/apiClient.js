import { get, getFullUrl, buildQueryString } from './apiHelper'

export default class ApiClient {

	findQuestions() {
		return get('/articles', {
			_sort: 'id',
			_order: 'DESC',
			_limit: '20'
		});
	}

	searchQuestions(keyword) {
		return get('/articles', {
			q: keyword,
			_sort: 'id',
			_order: 'DESC',
			_limit: '20'
		});
	}

	findQuestion(id) {
		return get(`/articles/${id}`);
	}
}