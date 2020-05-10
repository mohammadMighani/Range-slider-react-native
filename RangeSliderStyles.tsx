import { StyleSheet } from 'react-native'
import { Colors } from '../../Constants'
import { Dimension, GlobalStyles } from '../../GlobalStyles'

export const Styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12 * Dimension.scaleX
    },
    backgroundBar: {
        flex: 1,
        height: 4 * Dimension.scaleX,
        backgroundColor: Colors.lightGray,
        borderRadius: 20 * Dimension.scaleX
    },
    activeBar: {
        ...GlobalStyles.shadow,
        height: 4 * Dimension.scaleX,
        backgroundColor: Colors.greenDark,
        borderRadius: 20 * Dimension.scaleX,
        position: 'absolute',
        marginLeft: 12 * Dimension.scaleX
    },
    marker: {
        ...GlobalStyles.shadow,
        backgroundColor: Colors.pink,
        position: 'absolute',
        width: 24 * Dimension.scaleX,
        height: 24 * Dimension.scaleX,
        borderRadius: 24 * Dimension.scaleX
    }
})
