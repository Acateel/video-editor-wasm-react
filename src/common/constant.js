export const filters = [
  { name: 'none', setting: '' },
  { name: 'grayscale', setting: 'hue=s=0' },
  {
    name: 'sepia',
    setting:
      'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
  },
  { name: 'blur', setting: 'boxblur=5:1' },
  { name: 'allgreen', setting: 'colorchannelmixer=0:0:0:0:0:1:0:0:0:0:0:0'}
]
