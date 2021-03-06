import axios from 'axios';

module.exports = {

  init: async() => {
    try {
      let result;
      let findeIndex = await axios.get(`http://${sails.config.elasticsearch.host}/_aliases`);
      if( !findeIndex.data.trademuch ){
        result = await axios.put(`http://${sails.config.elasticsearch.host}/trademuch`,{
          mappings: {
            post: {
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                location: {
                  type: "geo_point",
                },
                pic:{
                  type: "string",
                },
              }
            }
          }
        });
        sails.log.info("Mappings OK!",result.data);
      }
      return result
    } catch (e) {
      sails.log.info("請啟動 elasticsearch, 並更新config, `docker-compose up -d elasticsearch`", e.message)
      throw e
    }
  },

  addPost: async({id, title, description, pic, location}) => {
    try {
      let result = await axios.post(`http://${sails.config.elasticsearch.host}/trademuch/post/${id}/_create`,{
        id: id,
        title: title,
        description: description,
        pic: pic,
        location: {
          lat: location.lat,
          lon: location.lon
        },
      });
      sails.log.info(result.data);
      return result.data
    } catch (e) {
      sails.log.error(e);
    }
  },

  deletePost: async(id) => {
    try {
      let result = await axios.delete(`http://${sails.config.elasticsearch.host}/trademuch/post/${id}`);
      sails.log.info(result.data);
      return result.data
    } catch (e) {
      sails.log.error(e);
    }
  },

  postPlace: async({distance, location, keyword, size , from }) => {
    try {
      size = size || 20;
      from = from || 0;
      let geoFilter;
      let filterQuery = {
        match_all: {}
      };
      let sort = [];
      if(keyword){
        // filterQuery = {
        //   term: {
        //     title: keyword
        //   }
        // }
        filterQuery = {
          match: {
            title: {
              query: keyword,
              fuzziness: 2,
              prefix_length: 1
            }
          }
        }
      }
      if(location){
        geoFilter = {
          geo_distance: {
            distance: distance || '10km',
            location: {
              lat: location.lat,
              lon: location.lon
            }
          }
        }
        sort.push( {
          _geo_distance: {
            location: {
              lat: location.lat,
              lon: location.lon
            },
            order: "asc",
            unit: "km",
            distance_type: "plane"
          }
        })
      }
      let data = {
        query: {
          filtered: {
            query: filterQuery,
            filter: geoFilter
          }
        },
        sort: sort
      };

      sails.log.info(JSON.stringify(data));

      let result = await axios({
        method: 'get',
        url: `http://${sails.config.elasticsearch.host}/trademuch/post/_search?size=${size}&from=${from}`,
        data: data
      });
      sails.log.info("query data",JSON.stringify(data, null, 2));
      sails.log.info("return data",JSON.stringify(result.data, null, 2));
      return ElasticsearchService.formate(result.data.hits.hits);
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  formate: (data) => {
    try {
      let postList;
      postList = data.map((post) => {
        return {
          score: post._score,
          ...post._source,
          distance: post.sort ? post.sort[0].toFixed(2) : -1,
          isFav: false,
        }
      });
      return postList;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  }
}
