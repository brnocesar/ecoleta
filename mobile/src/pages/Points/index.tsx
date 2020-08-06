import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location';


interface Item {
    id: number;
    title: string;
    image_url: string;
}
interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
}

const Points = () => {

    const navigation = useNavigation();
    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();

            if ( status !== 'granted' ) {
                Alert.alert('Ops...', 'Precisamos de sua permissão para obter a localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;
            setInitialPosition([
                latitude, 
                longitude
            ]);
        }

        loadPosition();
    }, []);

    useEffect(() => {
        if ( selectedItems.length === 0 ) {
            setPoints([])
            return;
        }
        api.get('points', {
            params: {
                // city: 'Curitiba',
                // uf: 'SP',
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data)
        });
    }, [selectedItems]);


    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleSeeAll() {
        navigation.navigate('PointIndex');
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate('Detail', {point_id: id});
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if ( alreadySelected >= 0 ) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
            return;
        }
        setSelectedItems([ ...selectedItems, id]);
    }


    return (

        <>
            <View style={styles.container} >
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={handleNavigateBack} >
                        <Icon name="arrow-left" size={30} color="#34cb79" />
                    </TouchableOpacity>
                    <Text style={styles.seeAll} onPress={handleSeeAll}>
                        {/* Ver todos<Icon name="chevron-right" size={24} /> */}
                        {/* Ver todos<Icon name="arrow-up-right" size={24} /> */}
                        Ver todos <Icon name="plus" size={24} />
                    </Text>
                </View>

                <Text style={styles.title}>Bem vindo</Text>
                <Text style={styles.description}>Selecione um item para encontrar um ponto de coleta próximo de você.</Text>

                <View style={styles.mapContainer}> 
                    { initialPosition[0] !== 0 && (
                        <MapView 
                            style={styles.map} 
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014,
                            }} 
                        >
                            {points.map(point => (
                                <Marker 
                                    key={String(point.id)}
                                    style={styles.mapMarker}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }} 
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image 
                                            style={styles.mapMarkerImage}
                                            source={{ uri: point.image_url }} 
                                        />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    ) }
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {items.map( item => (

                        <TouchableOpacity 
                            key={String(item.id)} 
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {},
                            ]} 
                            onPress={() => handleSelectItem(item.id)}
                            activeOpacity={0.7}
                        >
                            <SvgUri width={48} height={48} uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
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

    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    seeAll: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        color: '#322153',
    },

    title: {
        fontSize: 24,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
        color: '#322153',
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderWidth: 2,
        borderColor: '#6C6C8020',
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80, 
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;