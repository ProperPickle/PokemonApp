from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Pokemon
from .serializer import PokemonSerializer, RegisterSerializer

# Create your views here.

class ReactView(APIView):
    def get(self, request):
        pokemons = Pokemon.objects.all()
        serializer = PokemonSerializer(pokemons, many=True)
        return Response(serializer.data)
    def post(self, request):
        data = request.data
        for item in data:
            serializer = PokemonSerializer(data=item, many=False)
            if (serializer.is_valid()):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class IndexView(APIView):
    def _get_pokemon(self, pk):
        return get_object_or_404(Pokemon, pk=pk)

    def get(self, request, pk):
        pokemon = self._get_pokemon(pk)
        serializer = PokemonSerializer(pokemon)
        return Response(serializer.data)

    def patch(self, request, pk):
        pokemon = self._get_pokemon(pk)
        serializer = PokemonSerializer(pokemon, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        pokemon = self._get_pokemon(pk)
        pokemon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)