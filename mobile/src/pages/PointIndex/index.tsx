import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';


interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    items: string;
    city: string;
    uf: string;
}

const PointIndex = () => {

    const navigation = useNavigation();
    const [points, setPoints] = useState<Point[]>([]);


    useEffect(() => {
        api.get('points').then(response => {
            setPoints(response.data)
        });
    }, []);


    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate('Detail', {point_id: id});
    }


    return (

        <>
            <View style={styles.container} >
                <View>
                    <TouchableOpacity onPress={handleNavigateBack} >
                        <Icon name="arrow-left" size={30} color="#34cb79" />
                    </TouchableOpacity>
                </View>

                <View style={styles.title}>
                    <Text style={styles.titleText}>Pontos de coleta</Text>

                    <Text style={styles.titleFilter} onPress={() => {}} >
                        <Icon name="chevron-down" size={24} />Filtrar
                    </Text>
                </View>

                <View style={styles.pointsContainer}> 
                    <FlatList 
                        data={points}
                        renderItem={({item}) => (
                            
                            <TouchableOpacity 
                                key={String(item.id)} 
                                style={styles.pointsItem} 
                                activeOpacity={0.7}
                                onPress={() => {}}
                            >
                                <Image 
                                    style={styles.itemImage}
                                    source={{
                                        uri: `${item.image_url}`,
                                    }}
                                />
                                <View style={styles.itemText}>
                                    <Text style={styles.itemTitle}>{item.name}</Text>
                                    <Text style={styles.itemItems}>{item.items}</Text>
                                    <Text style={styles.itemAddress}>{item.city}, {item.uf}</Text>
                                </View>
                            </TouchableOpacity>
                        
                        )}
                    />
                </View>
            
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    seeAll: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        color: '#322153',
    },

    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    titleText: {
        fontSize: 24,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
        color: '#322153',
    },

    titleFilter: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 24,
        fontFamily: 'Roboto_400Regular',
    },

    pointsContainer: {
        flex: 1,
        width: '100%',
        marginVertical: 16,
    },

    pointsItem: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#6C6C8020',
        height: 120,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        marginBottom: 8,
    },

    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#6C6C80',
        marginRight: 8,
    },

    itemText: {
        flex: 1,
        flexDirection: 'column',
    },

    itemTitle: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        color: '#322153',
        flex: 1,
        alignSelf: 'flex-start',
    },

    itemItems: {
        color: '#34CB79',
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        flex: 1,
        alignSelf: 'flex-start',
    },

    itemAddress: {
        color: '#6C6C80',
        fontFamily: 'Roboto_400Regular',
        fontSize: 14,
        alignSelf: 'flex-start',
    },    
});

export default PointIndex;