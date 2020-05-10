import * as React from 'react'
import { Animated, PanResponder, PanResponderInstance, View } from 'react-native'
import { Dimension } from '../../GlobalStyles'
import { StyleType } from '../../Types'
import { Styles } from './RangeSliderStyles'

interface IRangeSliderProps {
    onValuesChange: (valueFirstMarker: number, valueSecondMarker: number) => void
    valueFirstMarker?: number
    valueSecondMarker?: number
    maximumValue?: number
    minimumValue?: number
    step?: number
    style?: StyleType
}

export class RangeSlider extends React.Component<IRangeSliderProps> {
    public static defaultProps: IRangeSliderProps = {
        onValuesChange: () => { },
        valueFirstMarker: 0,
        valueSecondMarker: 10,
        maximumValue: 10,
        minimumValue: 0,
        step: 1,
        style: null
    }

    public state = {
        xPositionFirst: 0,
        xPositionSecond: 0,
        valueFirst: 0,
        valueSecond: 0
    }

    private panResponderFirst: PanResponderInstance
    private panResponderSecond: PanResponderInstance
    private width: number = 200 * Dimension.scaleX
    private lastXFirst: number = 0
    private lastXSecond: number = 0
    private scaleRadiusAnimationFirst: Animated.Value = new Animated.Value(0)
    private scaleRadiusAnimationSecond: Animated.Value = new Animated.Value(0)
    private unitStep: number
    private duration: number = 100

    private constructor(props: IRangeSliderProps) {
        super(props)
        if (this.props.style !== null && this.props.style.width !== null) {
            this.width = this.props.style.width
        }
        this.unitStep = this.width / ((this.props.maximumValue - this.props.minimumValue) / this.props.step)
        this.setPanResponders()
    }

    public render() {
        const scaleRadiusFirst = this.scaleRadiusAnimationFirst.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.5]
        })
        const scaleRadiusSecond = this.scaleRadiusAnimationSecond.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.5]
        })

        return (
            <View
                style={[this.props.style, Styles.root]}
            >
                <View
                    style={Styles.backgroundBar}
                />
                <View
                    style={
                        [
                            Styles.activeBar,
                            {
                                transform: [
                                    {
                                        translateX: this.state.xPositionFirst
                                    }
                                ],
                                width: this.state.xPositionSecond - this.state.xPositionFirst
                            }
                        ]}
                />
                <Animated.View
                    {...this.panResponderFirst.panHandlers}
                    style={
                        [
                            Styles.marker,
                            {
                                transform: [
                                    {
                                        translateX: this.state.xPositionFirst
                                    }
                                ]
                            }
                        ]}
                >
                    <Animated.View
                        style={
                            [
                                Styles.marker,
                                {
                                    transform: [
                                        {
                                            scale: scaleRadiusFirst
                                        }
                                    ]
                                }
                            ]
                        }
                    />
                </Animated.View>
                <Animated.View
                    {...this.panResponderSecond.panHandlers}
                    style={
                        [
                            Styles.marker,
                            {
                                transform: [
                                    {
                                        translateX: this.state.xPositionSecond
                                    }
                                ]
                            }
                        ]
                    }
                >
                    <Animated.View
                        style={[
                            Styles.marker,
                            {
                                transform: [
                                    {
                                        scale: scaleRadiusSecond
                                    }
                                ]
                            }
                        ]}
                    />
                </Animated.View>
            </View>
        )
    }

    public componentDidMount() {
        this.setPositionFirst(this.props.valueFirstMarker)
        this.setPositionSecond(this.props.valueSecondMarker)
    }

    public setPositionFirst(value: number) {
        const firstFilledPercent = (value - this.props.minimumValue) /
            (this.props.maximumValue - this.props.minimumValue)
        this.setState({
            xPositionFirst: firstFilledPercent * this.width,
            valueFirst: value
        })
        this.lastXFirst = firstFilledPercent * this.width
    }
    public setPositionSecond(value: number) {
        const secondFilledPercent = (value - this.props.minimumValue) /
            (this.props.maximumValue - this.props.minimumValue)
        this.setState({
            xPositionSecond: secondFilledPercent * this.width,
            valueSecond: value
        })
        this.lastXSecond = secondFilledPercent * this.width
    }

    private setValueFirst(xPosition: number) {
        let xPositionFirst = xPosition
        let valueFirst = Math.round(xPositionFirst / this.unitStep) * this.props.step + this.props.minimumValue
        valueFirst = Math.min(valueFirst, this.props.maximumValue)
        valueFirst = Math.max(valueFirst, this.props.minimumValue)
        if (valueFirst === this.props.minimumValue) {
            this.setPositionFirst(this.props.minimumValue)
        }
        // if (valueFirst === this.state.valueFirst) {
        //     return
        // }
        xPositionFirst = Math.min(xPositionFirst, this.width)
        xPositionFirst = Math.max(xPositionFirst, 0)

        if (xPositionFirst > this.state.xPositionSecond) {
            this.setValueSecond(xPositionFirst)
            this.lastXSecond = xPositionFirst
        }
        this.setState({
            xPositionFirst,
            valueFirst
        })
        this.props.onValuesChange(valueFirst, this.state.valueSecond)
    }

    private setValueSecond(xPosition: number) {
        let xPositionSecond = xPosition
        let valueSecond = Math.round(xPositionSecond / this.unitStep) * this.props.step + this.props.minimumValue
        valueSecond = Math.min(valueSecond, this.props.maximumValue)
        valueSecond = Math.max(valueSecond, this.props.minimumValue)
        // if (valueSecond === this.state.valueSecond) {
        //     return
        // }
        xPositionSecond = Math.min(xPositionSecond, this.width)
        xPositionSecond = Math.max(xPositionSecond, 0)

        if (xPositionSecond < this.state.xPositionFirst) {
            this.setValueFirst(xPositionSecond)
            this.lastXFirst = xPositionSecond
        }
        this.setState({
            xPositionSecond,
            valueSecond
        })
        this.props.onValuesChange(this.state.valueFirst, valueSecond)
    }

    private setPanResponders(): void {
        this.panResponderFirst = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderStart: (event, gesture) => {
                Animated.timing(this.scaleRadiusAnimationFirst, {
                    toValue: 1,
                    duration: this.duration
                }).start()
            },
            onPanResponderMove: (event, gesture) => {
                const xPositionFirst = gesture.dx + this.lastXFirst
                this.setValueFirst(xPositionFirst)
            },
            onPanResponderRelease: (event, gesture) => {
                this.lastXFirst = this.state.xPositionFirst
                Animated.timing(this.scaleRadiusAnimationFirst, {
                    toValue: 0,
                    duration: this.duration
                }).start()
            }
        })

        this.panResponderSecond = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderStart: (event, gesture) => {
                Animated.timing(this.scaleRadiusAnimationSecond, {
                    toValue: 1,
                    duration: this.duration
                }).start()
            },
            onPanResponderMove: (event, gesture) => {
                const xPositionSecond = gesture.dx + this.lastXSecond
                this.setValueSecond(xPositionSecond)
            },
            onPanResponderRelease: (event, gesture) => {
                this.lastXSecond = this.state.xPositionSecond
                Animated.timing(this.scaleRadiusAnimationSecond, {
                    toValue: 0,
                    duration: this.duration
                }).start()
            }
        })
    }
}
