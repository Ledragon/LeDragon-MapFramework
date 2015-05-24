declare module interfaces{
	export interface country{
		geometries: Array<geometry>;
		type: string;
	}
	
	export interface geometry{
		arcs: Array<any>;
		properties: property;
		type: string;
	}
	
	export interface property{
		//TODO incomplete
		abbrev: string;
		abbrev_len: number;
		adm0_a3: string;
		continent: string;
		economy: string;
		formal_en: string;
		name: string;
		region_un: string;
	}
}