// Type definitions for TopoJSON
// Project: https://github.com/mbostock/topojson
// Definitions by: Hugues Stefanski <https://github.com/Ledragon/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped 
declare module TopoJSON {
    export interface TopoJSON {
        feature(topology, object);
        merge(topology, objects);
        mesh(topology, object, filter?);
        meshArcs(topology, objects?, filter?);
        neighbors(objects);
    }

    export interface TopoJSONObject {
        type: string;
        arcs?: Array<any>;
        objects: { countries: countries };
        transform: any;
    }
    
    export interface countries {
        type: string;
        geometries: Array<country>;
    }

    export interface country {
        type: string;
        properties: countryProperty;
        arcs?: any;
    }
    
    export interface countryProperty {
        scalerank: number;
        featurecla: string;
        labelrank: number;
        adm0_a3: string;
        sov_a3: string;
        adm0_dif: number;
        level: number;
        type: string;
        admin: string;
        geou_dif: number;
        geounit: string;
        gu_a3: string;
        su_dif: number;
        subunit: string;
        su_a3: string;
        brk_diff: number;
        name: string;
        name_long: string;
        brk_a3: string;
        brk_name: string;
        brk_group: any;
        abbrev: string;
        postal: string;
        formal_en: string;
        formal_fr: string;
        note_adm0: any;
        note_brk: any;
        name_sort: string;
        name_alt: any;
        mapcolor7: number;
        mapcolor8: number;
        mapcolor9: number;
        mapcolor13: number;
        pop_est: number;
        gdp_md_est: number;
        pop_year: number;
        lastcensus: number;
        gdp: number;
        economy: string;
        income_grp: string;
        wikipedia: number;
        fips_10: any;
        iso_a2: string;
        iso_a3: string;
        iso_n3: string;
        un_a3: string;
        wb_a2: string;
        wb_a3: string;
        woe_id: number;
        adm0_a3_is: string;
        adm0_a3_us: string;
        adm0_a3_un: string;
        adm0_a3_wb: string;
        continent: string;
        region_un: string;
        subregion: string;
        region_wb: string;
        name_len: number;
        long_len: number;
        abbrev_len: number;
        tiny: number;
        homepart: number;
    }

}

declare var topojson: TopoJSON.TopoJSON;