import React from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  FlatList, 
  Image, 
  Pressable, 
  StyleSheet 
} from 'react-native';
import BottomNavigation from '../componentes/menu';
import { useFavorites } from '@/providers/FavoritesProvider';

export default function Favorites() {
  const { getFavoriteProducts, toggleFavorite, favorites } = useFavorites();
  const favoriteProducts = getFavoriteProducts();

  const renderFavoriteProduct = ({ item }: { item: any }) => {
    const isFavorite = favorites.includes(item.id);
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <Pressable 
            style={styles.favoriteButton} 
            onPress={() => toggleFavorite(item.id)}
          >
            <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
              {isFavorite ? "❤️" : "🤍"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.productInfo}>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Favoritos</Text>
        <Text style={styles.subtitle}>
          {favoriteProducts.length} producto{favoriteProducts.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyText}>No tienes productos favoritos</Text>
          <Text style={styles.emptySubtext}>
            Agrega productos a favoritos desde la página principal
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          renderItem={renderFavoriteProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <BottomNavigation activeTab={1} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  gridContainer: {
    padding: 16
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 8
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover'
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteIcon: {
    fontSize: 16
  },
  favoriteActive: {
    color: '#e74c3c'
  },
  productInfo: {
    gap: 4
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  star: {
    fontSize: 12,
    marginRight: 4
  },
  rating: {
    fontSize: 12,
    color: '#666'
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 4
  }
});