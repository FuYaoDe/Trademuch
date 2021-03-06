import axios from 'axios';

describe('about Elasticsearch Service .', function() {
  let elastic;
  describe('init', () => {

    // let testUser,place;
    before(async (done) => {
      try {

        let findeIndex = await axios.get(`http://${sails.config.elasticsearch.host}/_aliases`);
        if( findeIndex.data.trademuch ){
          let result = await axios({
            method: 'delete',
            url: `http://${sails.config.elasticsearch.host}/trademuch`
          });
          console.log(result);
        }

        done();
      } catch (e) {
        sails.log.error(e)
        done(e);
      }
    });

    it('test init', async (done) => {
      try {
        await ElasticsearchService.init();
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });
  });

  describe('test add place', () => {

    // let testUser,place;
    before(async (done) => {
      try {
        let findeIndex = await axios.get(`http://${sails.config.elasticsearch.host}/_aliases`);
        if( findeIndex.data.trademuch ){
          let result = await axios({
            method: 'delete',
            url: `http://${sails.config.elasticsearch.host}/trademuch`
          });
          console.log(result);
        }
        await ElasticsearchService.init();
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    });

    it('test add', async (done) => {
      try {
        let result = await ElasticsearchService.addPost({
          id: 123123123,
          title: 'testElasticTitle',
          location:{
            lat: 24,
            lon: 120
          }
        });
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });
  });

  describe('test search place', () => {

    // let testUser,place;
    before(async (done) => {
      try {
        let findeIndex = await axios.get(`http://${sails.config.elasticsearch.host}/_aliases`);
        if( findeIndex.data.trademuch ){
          let result = await axios({
            method: 'delete',
            url: `http://${sails.config.elasticsearch.host}/trademuch`
          });
          console.log(result);
        }
        await ElasticsearchService.init();
        await ElasticsearchService.addPost({
          id: 9991,
          title: 'test Elastic Title 2',
          location:{
            lat: 24,
            lon: 120
          }
        })
        await ElasticsearchService.addPost({
          id: 9992,
          title: 'test Elastic Title 2',
          location:{
            lat: 24.1,
            lon: 120.1
          }
        })
        await ElasticsearchService.addPost({
          id: 9994,
          title: 'test Elastic Title 4',
          location:{
            lat: 30,
            lon: 80
          }
        })
        await ElasticsearchService.addPost({
          id: 9993,
          title: 'test Elastic termTest 1',
          location:{
            lat: 24.08,
            lon: 120.08
          }
        })
        await ElasticsearchService.addPost({
          id: 9995,
          title: 'test Elastic termTest 2',
          location:{
            lat: 80,
            lon: 100
          }
        })
        await ElasticsearchService.addPost({
          id: 9996,
          title: 'test Elastic termTest 2',
          location:{
            lat: 80.1,
            lon: 100
          }
        })
        await ElasticsearchService.addPost({
          id: 9997,
          title: 'AAA',
          location:{
            lat: 80.1,
            lon: 100
          }
        })
        await ElasticsearchService.addPost({
          id: 9998,
          title: '測試測試',
          location:{
            lat: 80.1,
            lon: 100
          }
        })
        await ElasticsearchService.addPost({
          id: 9999,
          title: '二手iphone',
          description: '描述',
          pic: '/url/test',
          location:{
            lat: 80.1,
            lon: 100
          }
        })
        await ElasticsearchService.addPost({
          id: 10000,
          title: '二手 Mac',
          location:{
            lat: 80.1,
            lon: 100
          }
        })
        await new Promise(done => setTimeout(done, 3000));
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    });

    it('test add search 20km ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          distance: '20km',
          location: {
            lat: 24,
            lon: 120
          }
        });
        console.log(result);
        result.length.should.be.equal(3);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "termTest"
        });
        console.log(result);
        result.length.should.be.equal(3);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword & geo', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          distance: '20km',
          keyword: "termTest",
          location: {
            lat: 80,
            lon: 100
          }
        });
        console.log(result);
        result.length.should.be.equal(2);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "AA"
        });
        console.log(result);
        result.length.should.be.equal(1);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "測試"
        });
        console.log(result);
        result.length.should.be.equal(1);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "測"
        });
        console.log(result);
        result.length.should.be.equal(1);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "二手"
        });
        console.log(result);
        result.length.should.be.equal(2);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "iphone"
        });
        result.length.should.be.equal(1);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

    it('test add search keyword ', (done) => {
      try {
        let result = ElasticsearchService.formate([
          {
            "_index": "trademuch",
            "_type": "post",
            "_id": "AVPL1NPEHPDH2Yg4DKmQ",
            "_score": 1.049306,
            "_source": {
              "id": 4,
              "title": "二手iphone",
              "location": {
                "lat": 80.1,
                "lon": 100
              }
            }
          }
        ]);
        console.log(JSON.stringify(result, null, 2));
        result.length.should.be.equal(1);
        result[0].score.should.be.Integer;
        result[0].id.should.be.Integer;
        result[0].title.should.be.String;
        result[0].location.lat.should.be.Integer;
        result[0].location.lon.should.be.Integer;
        result[0].distance.should.be.Integer;
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });


    it('test size ', async (done) => {
      try {
        let result = await ElasticsearchService.postPlace({
          keyword: "termTest",
          size: 2
        });
        console.log(result);
        result.length.should.be.equal(2);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });

  });

  describe('test delete place', () => {

    // let testUser,place;
    before(async (done) => {
      try {
        let findIndex = await axios.get(`http://${sails.config.elasticsearch.host}/_aliases`);
        const hasTrademuch = findIndex.data.trademuch;
        if (hasTrademuch){
          let result = await axios({
            method: 'delete',
            url: `http://${sails.config.elasticsearch.host}/trademuch`
          });
          console.log("create => ",result);
        }
        await ElasticsearchService.init();
        let result = await ElasticsearchService.addPost({
            id: 8493,
            title: 'testElasticTitle',
            location:{
              lat: 24,
              lon: 120
            }
          });
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    });

    it('test delete', async (done) => {
      try {
        let result = await ElasticsearchService.deletePost(8493);
        done();
      } catch (e) {
        sails.log.error(e);
        done(e);
      }
    });
  });

});
