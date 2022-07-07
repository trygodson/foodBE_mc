import express, { Request, Response, NextFunction } from 'express';
import {
  GetFood38Min,
  GetFoodAvailability,
  GetTopRestaurant,
  RestaurantByID,
  SearchFoods,
} from '../controllers';
const router = express.Router();

//food availability
router.get('/:pincode', GetFoodAvailability);

//top restaurants
router.get('/top-restaurant/:pincode', GetTopRestaurant);

//food available in thirty minutes
router.get('/foods-in-30-min/:pincode', GetFood38Min);

//search foods
router.get('/search/:pincode', SearchFoods);

//restaurant by id
router.get('/restaurant/:id', RestaurantByID);

export { router as ShoppingRoute };
