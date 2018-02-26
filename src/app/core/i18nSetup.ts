import { environment as env } from './../../environments/environment.prod' ;

export const AllSupportedLanguage = ['en', 'ru', 'ar', 'zh'];

export let DefaultLanguage: string;

if (env.china) {
	DefaultLanguage = 'zh';
} else {
	DefaultLanguage = 'en';
}
