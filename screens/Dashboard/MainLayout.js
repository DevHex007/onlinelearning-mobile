import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated
} from 'react-native';
import {
    Shadow
}from 'react-native-shadow-2'
import {
    Home,
    Profile,
    Search
}from '../../screens'
import {connect} from 'react-redux';
import {
    COLORS,
    SIZES,
    FONTS,
    constants
} from '../../constants' 
import { measure, interpolate } from 'react-native-reanimated';

const bottom_tabs = constants.bottom_tabs.map((bottom_tab) => ({
    ...bottom_tab,
    ref: React.createRef()
}))

const TabIndicator = ({measureLayout, scrollX}) => {
    const inputRange = bottom_tabs.map((_, i) => i * SIZES.width)

    const tabIndicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.width)
    })

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.x)
    })
    return(
        <Animated.View 
            style={{
                position: 'absolute',
                left: 0,
                height: '100%',
                width: tabIndicatorWidth,
                borderRadius:SIZES.radius,
                backgroundColor: COLORS.primary,
                transform: [{
                    translateX
                }]
            }}
        />
    )
}

const Tabs = ({scrollX, onBottomTabPress}) => {

    const containerRef = React.useRef()
    const [measureLayout, setMeasureLayout] = React.useState([])

    React.useEffect(() => {
        let al = []

        bottom_tabs.forEach(bottom_tab => {
            bottom_tab?.ref?.current?.measureLayout(
                containerRef.current,
                (x, y, width, height) => {
                    al.push({
                        x, y, width, height
                    })
                    if(al.length === bottom_tabs.length){
                        setMeasureLayout(al)
                    }
                }
            )
        })
    },[containerRef.current])

    return(
        <View
            ref={containerRef}
            style={{
                flex: 1,
                flexDirection: 'row'
            }}
        >
            {/** Tab Indicators */}
            {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />}
            {/**Tabs */}
            {bottom_tabs.map((item, index) => {
                return(
                    <TouchableOpacity
                        key={`BottomTab-${index}`}
                        ref={item.ref}
                        style={{
                            flex: 1,
                            paddingHorizontal: 15,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => onBottomTabPress(index)}
                    >
                        <Image
                            source={item.icon}
                            resizeMode='contain'
                            style={{
                                height: 25,
                                width: 25
                            }}
                        />
                        <Text
                            style={{
                                marginTop: 3,
                                color: COLORS.white,
                                ...FONTS.h3
                            }}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const MainLayout = ({appTheme}) => {

    const flatListRef = React.useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current

    const onBottomTabPress = React.useCallback(bottomTabIndex => {
        flatListRef?.current?.scrollToOffset({
            offset: bottomTabIndex * SIZES.width
        })
    })

    function renderContent() {
        return(
            <View
                style={{
                    flex: 1
                }}
            >
                <Animated.FlatList
                    ref={flatListRef}
                    horizontal
                    scrollEnabled={false}
                    pagingEnabled
                    snapToAlignment='center'
                    snapToInterval={SIZES.width}
                    decelerationRate='fast'
                    showHorizontalScrollIndicator={false}
                    data={constants.bottom_tabs}
                    keyExtractor={item => `Main-${item.id}`}
                    onScroll={
                        Animated.event([
                            { nativeEvent: { contentOffset: { x: scrollX}}}
                        ], {
                            useNativeDriver: false
                        })
                    }
                    renderItem={({ item, index}) => {
                        return(
                            <View
                                style={{
                                    height: SIZES.height,
                                    width: SIZES.width
                                }}
                            >
                                {item.label === constants.screens.home && <Home />}
                                {item.label === constants.screens.search && <Search />}
                                {item.label === constants.screens.profile && <Profile />}
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
  function renderBottomTab(){
    return(
        <View
            style={{
                paddinBottom: SIZES.height > 800 ? 20 : 5,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                backgroundColor: appTheme?.backgroundColor1
            }}
        >
            <Shadow
                size={[SIZES.width - (SIZES.padding * 2), 85]}
            >
                <View
                    style={{
                        flex: 1,
                        borderRadius: SIZES.radius,
                        backgroundColor:appTheme?.backgroundColor2
                    }}
                >
                    <Tabs
                        scrollX={scrollX}
                        onBottomTabPress={onBottomTabPress}
                    />
                </View>
            </Shadow>
        </View>
    )
  }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            {/** Conten */}
            {renderContent()}

            {/**Bottom Tabs */}
            {renderBottomTab()}
        </View>
    )
}
function mapStateToProps(state){
    return {
        appTheme: state.appTheme,
    }
}
function mapDispatchToProps(dispatch){
    return {
        
    }
}
export default connect(mapStateToProps, mapDispatchToProps) (MainLayout);
