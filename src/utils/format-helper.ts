export const convertToV2 = (data: SitesDataV1[]): SitesDataV2[] => {
	return data.map((item) => ({
		category: Object.keys(item)[0].replace('[open]', ''),
		sites: Object.values(item)[0].map((site) => ({
			name: site[0],
			url: site[1],
			desc: site[2],
		})),
	}));
}
