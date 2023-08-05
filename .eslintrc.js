module.exports = {
	'env': {
		'commonjs': true,
		'es2021': true,
		'node':true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'overrides': [
		{
			'env': {
				'node': true
			},
			'files': [
				'.eslintrc.{js,cjs}'
			],
			'parserOptions': {
				'sourceType': 'script'
			}
		}
	],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'plugins': [
		'react'
	],
	'rules': {
		'indent':0,
		'quotes': 0,
		'semi': [
			'error',
			'never'
		],
		'linebreak-style':0
	}
}
