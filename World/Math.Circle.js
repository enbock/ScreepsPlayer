/**
 * Bresenham raster circle algotrithm.
 *
 * @param {RoomPosition} pos Center of the circle.
 * @param {int} radius The radius of the circle. 
 * @param {int} step Steps.
 *
 * @see https://de.wikipedia.org/wiki/Bresenham-Algorithmus
 */
module.exports = function(pos, radius, step)
{
  if(!step) step=1;
  var x0 = pos.x;
  var y0 = pos.y;
  var cache;
  cache = Memory.BresenhamCirlce;
  if(!cache) {
      cache = {};
      Memory.BresenhamCirlce = cache;
  }
  var key = x0+","+y0+","+radius+":"+step;
  if (cache[key]) return cache[key];

  var f = 1 - radius;
  var ddF_x = 0;
  var ddF_y = -2 * radius;
  var x = 0;
  var y = radius;

  var coords = [];
  var cnt = 1;

  coords.push([x0, y0 + radius]);
  coords.push([x0, y0 - radius]);
  coords.push([x0 + radius, y0]);
  coords.push([x0 - radius, y0]);

  while(x < y)
  {
    if(f >= 0)
    {
      y--;
      ddF_y += 2;
      f += ddF_y;
    }
    x++;
    ddF_x += 2;
    f += ddF_x + 1;

    cnt ++;

    if (cnt % step == 0) {
      coords.push([x0 + x, y0 + y]);
      coords.push([x0 - x, y0 + y]);
      coords.push([x0 + x, y0 - y]);
      coords.push([x0 - x, y0 - y]);
      coords.push([x0 + y, y0 + x]);
      coords.push([x0 - y, y0 + x]);
      coords.push([x0 + y, y0 - x]);
      coords.push([x0 - y, y0 - x]);
    }
  }

  cache[key] = coords;
  return coords;
}