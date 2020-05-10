# react-native-multi-slider

Type script react native range slider component.
this range slider has two markers.

### Image
![sample image range slider](sample.png)

### Usage

```ts
 render() {
   return (
    <RangeSlider
        ref={(ref) => { this.SliderRef = ref }}
        onValuesChange={this.onValuesChange}
        valueFirstMarker={5}
        valueSecondMarker={20}
        maximumValue={0}
        minimumValue={50}
        step={5}
        style={Styles.slider}
    /> 
    );
```