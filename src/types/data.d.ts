type Searchable = {
	title: string,
	abbr?: string,
	search?: string,
	note?: string,
	url: string
};

/** @author teaSummer */
type SitesDataV1 = {
	[category: string]: [string, string, string?][];
};

/** @author LateDreamXD */
type SitesDataV2 = {
	category: string;
	sites: {
		name: string;
		url: string;
		desc?: string;
	}[];
};
