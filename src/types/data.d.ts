/**
 * 可搜索的站点数据格式
 * @see {@link https://github.com/teaSummer/MCiSEE/blob/main/CONTRIBUTING.md#searchablejson}
 * @author teaSummer
 */
type Searchable = {
	/** 站点完整标题。 */
	title: string,
	/** 可选。简称，若不填写此属性，将与 title 值保持一致。 */
	abbr?: string,
	/** 搜索后跳转的地址 URL，使用 `<T>` 表示关键词，留空则由前端处理。 */
	search?: string,
	/** 可选。备注。 */
	note?: string,
	/** 可选。站点主页地址 URL。 */
	url?: string
};

/**
 * 旧版网站数据格式
 * @author teaSummer
 */
type SitesDataV1 = {
	[category: string]: [string, string, string?][];
};

/**
 * 扁平化后的网站数据格式
 * @see {@link https://github.com/teaSummer/MCiSEE/blob/main/CONTRIBUTING.md#utilitywebsitejson}
 * @author LateDreamXD, teaSummer
 */
type SitesDataV2 = {
	/** 网站分类。 */
	category: string;
	/** 属于该分类的网站。 */
	sites: {
		/** 网站名称。 */
		name: string;
		/** 网站地址 URL。 */
		url: string;
		/** 可选。网站简介。 */
		desc?: string;

		// extend by @teaSummer
		/** 可选。网站图标。若不填写此属性，则调用 API 获取。 */
		icon?: string;
		/** 可选。若为 `true`，则将 `name` 和 `desc` 的值视为语言文件中的键。 */
		autoLang?: boolean;
	}[];
};

type DataType = 'data' | 'locales';

type DataFile =
	'forum.json' |
	'launcher.json' |
	'searchable.json' |
	'utilityWebsite.json';

type LocalesFiles =
	'zh-CN.json' |
	'zh-HK.json' |
	'zh-TW.json' |
	'lzh.json' |
	'pt-BR.json' |
	'it-IT.json' |
	'en-US.json' |
	'en-UD.json';

type ListedDataFiles = DataFile | LocalesFiles;
