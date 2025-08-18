# import random
# from django.core.management.base import BaseCommand
# from django.contrib.auth.hashers import make_password
# from users.models import CustomUser
# from listings.models import Listing

# class Command(BaseCommand):
#     help = 'Seeds the database with new lister users and listings (without images).'

#     def add_arguments(self, parser):
#         parser.add_argument('count', type=int, help='The total number of listings to create.')

#     def handle(self, *args, **kwargs):
#         count = kwargs['count']
        
#         # --- Create 5 new, random Lister users ---
#         listers = []
#         for i in range(5):
#             username = f'listeruser{i+1}'
#             user, created = CustomUser.objects.get_or_create(
#                 username=username,
#                 defaults={
#                     'email': f'lister{i+1}@example.com',
#                     'password': make_password('password123'), # All users have the password 'password123'
#                     'role': 'Lister',
#                     'city': random.choice(['Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore']),
#                     'cleanliness': random.randint(1, 5),
#                     'sleep_schedule': random.choice(['early-bird', 'night-owl', 'flexible']),
#                     'mbti_type': random.choice(['ISTJ', 'INFJ', 'ENTP', 'ESFP']),
#                 }
#             )
#             listers.append(user)
#             if created:
#                 self.stdout.write(self.style.SUCCESS(f'Created lister: {username} (password: password123)'))

#         # --- Distribute new listings among these listers ---
#         for i in range(count):
#             lister_user = random.choice(listers)
            
#             listing = Listing.objects.create(
#                 lister=lister_user,
#                 title=f'Spacious & Bright Room in {lister_user.city}',
#                 address=f'{100 + i*12} Blossom Avenue, {lister_user.city}',
#                 city=lister_user.city,
#                 description='A clean, quiet, and comfortable room perfect for a student or young professional. Fully furnished with access to all common areas including a modern kitchen and high-speed internet.',
#                 rent=random.randint(15000, 55000),
#                 pets_allowed=random.choice([True, False]),
#                 smoking_allowed=random.choice([True, False]),
#                 latitude=round(23.0225 + (random.random() - 0.5) * 0.2, 6),
#                 longitude=round(72.5714 + (random.random() - 0.5) * 0.2, 6)
#             )
#             self.stdout.write(self.style.SUCCESS(f'Created listing "{listing.title}" for user "{lister_user.username}"'))

#         self.stdout.write(self.style.SUCCESS(f'\nFinished seeding {count} new listings.'))

# import random
# from django.core.management.base import BaseCommand
# from django.contrib.auth.hashers import make_password
# from users.models import CustomUser

# class Command(BaseCommand):
#     help = 'Seeds the database with new Seeker users designed to match existing Listers.'

#     def handle(self, *args, **kwargs):
#         self.stdout.write(self.style.SUCCESS('--- Starting to seed new Seeker users ---'))

#         # --- Define Seeker Personas to Match a Variety of Listers ---
#         seeker_personas = [
#             {
#                 'username': 'art_seeker', 'email': 'seeker1@example.com', 'role': 'Seeker', 
#                 'city': 'Mumbai', 'cleanliness': 4, 'sleep_schedule': 'Night Owl', 
#                 'mbti_type': 'INFP', 'occupation': 'Creative', 'budget': 25000
#             },
#             {
#                 'username': 'code_seeker', 'email': 'seeker2@example.com', 'role': 'Seeker', 
#                 'city': 'Bangalore', 'cleanliness': 5, 'sleep_schedule': 'Early Bird', 
#                 'mbti_type': 'ISTJ', 'occupation': 'Tech', 'budget': 45000
#             },
#             {
#                 'username': 'money_seeker', 'email': 'seeker3@example.com', 'role': 'Seeker', 
#                 'city': 'Delhi', 'cleanliness': 3, 'sleep_schedule': 'Flexible', 
#                 'mbti_type': 'ESTJ', 'occupation': 'Finance', 'budget': 35000
#             },
#             {
#                 'username': 'doc_seeker', 'email': 'seeker4@example.com', 'role': 'Seeker', 
#                 'city': 'Ahmedabad', 'cleanliness': 5, 'sleep_schedule': 'Early Bird', 
#                 'mbti_type': 'ESFJ', 'occupation': 'Healthcare', 'budget': 20000
#             },
#             {
#                 'username': 'grad_seeker', 'email': 'seeker5@example.com', 'role': 'Seeker', 
#                 'city': 'Mumbai', 'cleanliness': 3, 'sleep_schedule': 'Night Owl', 
#                 'mbti_type': 'ENTP', 'occupation': 'Student', 'budget': 18000
#             },
#         ]

#         seekers_created_count = 0
#         for persona in seeker_personas:
#             # get_or_create prevents creating duplicate users if the script is run again
#             user, created = CustomUser.objects.get_or_create(
#                 username=persona['username'],
#                 defaults={
#                     'email': persona['email'],
#                     'password': make_password('password123'), # All users have the password 'password123'
#                     'role': 'Seeker',
#                     'city': persona['city'],
#                     'cleanliness': persona['cleanliness'],
#                     'sleep_schedule': persona['sleep_schedule'],
#                     'mbti_type': persona['mbti_type'],
#                     'occupation': persona['occupation'],
#                     'budget': persona['budget'],
#                     # Add other seeker-specific fields with defaults if needed
#                     'noise_level': random.randint(2, 4),
#                     'social_level': random.choice(['Friendly but independent', 'Very social / Friends']),
#                     'guest_frequency': 'Occasionally',
#                     'smoking': 'Non-Smoker',
#                     'has_pets': False,
#                     'gender_preference': 'No Preference',
#                     'work_schedule': '9-to-5',
#                 }
#             )
            
#             if created:
#                 self.stdout.write(self.style.SUCCESS(f"Created Seeker: {persona['username']} (password: password123)"))
#                 seekers_created_count += 1
#             else:
#                 self.stdout.write(self.style.WARNING(f"Seeker '{persona['username']}' already exists. Skipping."))

#         self.stdout.write(self.style.SUCCESS(f'\nFinished seeding. Added {seekers_created_count} new Seeker users.'))

import random
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Updates or creates Seeker users with varied data to test ML matching.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('--- Starting to seed/update Seeker users ---'))

        seeker_personas = [
            {
                'username': 'art_seeker', 'email': 'seeker1@example.com', 'city': 'Mumbai', 
                'cleanliness': 5, 'sleep_schedule': 'Night Owl', 'mbti_type': 'INFP', 
                'occupation': 'Creative', 'budget': 26000, 'social_level': 'Very social / Friends'
            },
            {
                'username': 'code_seeker', 'email': 'seeker2@example.com', 'city': 'Bangalore', 
                'cleanliness': 4, 'sleep_schedule': 'Early Bird', 'mbti_type': 'ISTJ', 
                'occupation': 'Tech', 'budget': 48000, 'smoking': 'Smokes Outside'
            },
            {
                'username': 'money_seeker', 'email': 'seeker3@example.com', 'city': 'Delhi', 
                'cleanliness': 3, 'sleep_schedule': 'Flexible', 'mbti_type': 'ENTJ', 
                'occupation': 'Finance', 'budget': 33000, 'has_pets': True
            },
            {
                'username': 'doc_seeker', 'email': 'seeker4@example.com', 'city': 'Ahmedabad', 
                'cleanliness': 5, 'sleep_schedule': 'Early Bird', 'mbti_type': 'ISFJ', 
                'occupation': 'Healthcare', 'budget': 22000, 'noise_level': 2
            },
            {
                'username': 'grad_seeker', 'email': 'seeker5@example.com', 'city': 'Mumbai', 
                'cleanliness': 2, 'sleep_schedule': 'Night Owl', 'mbti_type': 'ENTP', 
                'occupation': 'Student', 'budget': 17000, 'guest_frequency': 'Frequently'
            },
        ]

        seekers_updated_count = 0
        seekers_created_count = 0
        for persona in seeker_personas:
            user, created = CustomUser.objects.update_or_create(
                username=persona['username'],
                defaults={
                    'email': persona['email'],
                    'password': make_password('password123'),
                    'role': 'Seeker',
                    'city': persona.get('city', 'Not Set'),
                    'cleanliness': persona.get('cleanliness', 3),
                    'sleep_schedule': persona.get('sleep_schedule', 'Flexible'),
                    'mbti_type': persona.get('mbti_type', 'INFP'),
                    'occupation': persona.get('occupation', 'Student'),
                    'budget': persona.get('budget', 20000),
                    'noise_level': persona.get('noise_level', random.randint(2, 4)),
                    'social_level': persona.get('social_level', 'Friendly but independent'),
                    'guest_frequency': persona.get('guest_frequency', 'Occasionally'),
                    'smoking': persona.get('smoking', 'Non-Smoker'),
                    'has_pets': persona.get('has_pets', False),
                    'gender_preference': 'No Preference',
                    'work_schedule': '9-to-5',
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Seeker: {persona['username']}"))
                seekers_created_count += 1
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated Seeker: {persona['username']}"))
                seekers_updated_count += 1

        self.stdout.write(self.style.SUCCESS(f'\nFinished seeding. Created {seekers_created_count}, Updated {seekers_updated_count} Seeker users.'))
